# Optimization Configuration
$TargetWidth = 1920
$Quality = 80
$BackupDir = Join-Path $PSScriptRoot "images_backup"

# Ensure System.Drawing is loaded
Add-Type -AssemblyName System.Drawing

# Create Backup Directory
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
    Write-Host "Created backup directory: $BackupDir"
}

# Function to Resize and Compress Image
function Optimize-Image {
    param (
        [string]$FilePath
    )

    try {
        $img = [System.Drawing.Image]::FromFile($FilePath)
    }
    catch {
        Write-Warning "Could not load image: $FilePath"
        return
    }

    $needsSave = $false
    $newWidth = $img.Width
    $newHeight = $img.Height

    # Resize if needed
    if ($img.Width -gt $TargetWidth) {
        $newWidth = $TargetWidth
        $newHeight = [math]::Round($img.Height * ($TargetWidth / $img.Width))
        $needsSave = $true
    }

    # Process if resize needed or if file size is large (we'll just re-save JPEGs to ensure quality)
    $ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
    
    if ($ext -in @(".jpg", ".jpeg") -or $needsSave) {
        
        # Create Backup
        $relPath = $FilePath.Substring($PSScriptRoot.Length + 1)
        $backupPath = Join-Path $BackupDir $relPath
        $backupParent = Split-Path $backupPath
        if (-not (Test-Path $backupParent)) {
            New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
        }
        if (-not (Test-Path $backupPath)) {
            Copy-Item $FilePath $backupPath
        }

        # Create new bitmap
        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graph = [System.Drawing.Graphics]::FromImage($bmp)
        
        # Simplify graphics settings to avoid type errors
        # Default interpolation is usually bilinear or similar, which is okay.
        # $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)
        $graph.Dispose()
        
        $img.Dispose() # Release original file handle

        # Encoder params for quality
        try {
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            if ($ext -eq ".png") {
                 $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/png" }
                 $bmp.Save($FilePath, $codec.FormatID)
            } else {
                 # JPEG
                 if ($codec) {
                     $eParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                     $eParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
                     $bmp.Save($FilePath, $codec, $eParams)
                 } else {
                     # Fallback if no codec found (unlikely)
                     $bmp.Save($FilePath)
                 }
            }
            Write-Host "Optimized: $relPath"
        } catch {
            Write-Warning "Failed to save optimized image for $FilePath : $_"
        }
        
        $bmp.Dispose()
    } else {
        $img.Dispose()
    }
}

# Scan and Process
$images = Get-ChildItem -Path $PSScriptRoot -Recurse -Include *.jpg,*.jpeg,*.png | Where-Object { $_.FullName -notlike "*images_backup*" -and $_.FullName -notlike "*node_modules*" }

foreach ($image in $images) {
    if ($image.Length -gt 0) {
        Optimize-Image -FilePath $image.FullName
    }
}

Write-Host "Optimization Complete!"

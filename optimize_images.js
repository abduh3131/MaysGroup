const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const TARGET_WIDTH = 1920;
const QUALITY = 80;
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ROOT_DIR = process.cwd();
const BACKUP_DIR = path.join(ROOT_DIR, 'images_backup');

// Ensure sharp is installed
try {
    require.resolve('sharp');
} catch (e) {
    console.log('Installing sharp...');
    try {
        execSync('npm install sharp', { stdio: 'inherit' });
    } catch (err) {
        console.error('Failed to install sharp. Please run "npm install sharp" manually.');
        process.exit(1);
    }
}
const sharp = require('sharp');

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

async function processImages() {
    const allFiles = getAllFiles(ROOT_DIR);
    const imageFiles = allFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return EXTENSIONS.includes(ext) && !file.includes('node_modules') && !file.includes('images_backup');
    });

    console.log(`Found ${imageFiles.length} images.`);

    for (const file of imageFiles) {
        const relativePath = path.relative(ROOT_DIR, file);
        const backupPath = path.join(BACKUP_DIR, relativePath);
        const backupDir = path.dirname(backupPath);

        // Create directory structure in backup
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Backup
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(file, backupPath);
        }

        try {
            const metadata = await sharp(file).metadata();

            // Skip if small enough
            if (metadata.width <= TARGET_WIDTH && metadata.format !== 'png') {
                // Even if width is small, we might want to compress if it's large in bytes? 
                // For now, let's just resize large ones and re-compress indiscriminately to ensure optimization.
                // Actually, let's check strict width condition to avoid processing tiny icons too much,
                // but we SHOULD compress everything.
            }

            // Logic:
            // 1. Resize if width > 1920
            // 2. Compress (jpeg quality, png compression)

            const image = sharp(file);

            if (metadata.width > TARGET_WIDTH) {
                image.resize({ width: TARGET_WIDTH });
            }

            if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
                image.jpeg({ quality: QUALITY, mozjpeg: true });
            } else if (metadata.format === 'png') {
                image.png({ quality: QUALITY, compressionLevel: 9 });
            } else if (metadata.format === 'webp') {
                image.webp({ quality: QUALITY });
            }

            const buffer = await image.toBuffer();
            fs.writeFileSync(file, buffer);

            console.log(`Optimized: ${relativePath}`);
        } catch (error) {
            console.error(`Error processing ${relativePath}:`, error.message);
        }
    }
    console.log('Done!');
}

processImages();

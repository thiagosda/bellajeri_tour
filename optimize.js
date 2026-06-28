const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = 'c:\\Users\\thiag\\bellajeri_tour\\bellajeri_tour';
const imgDir = path.join(rootDir, 'imagens');

async function optimizeImages() {
    console.log('Optimizing images...');
    const files = fs.readdirSync(imgDir);
    const mapping = {}; // oldName -> newName

    for (const file of files) {
        if (file.endsWith('.svg') || file.endsWith('.webp')) continue; // Skip SVG and already WebP
        
        const filePath = path.join(imgDir, file);
        const stat = fs.statSync(filePath);
        
        // Only optimize if larger than 150KB or it's a common image format
        if (file.match(/\.(png|jpg|jpeg|avif)$/i)) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const newName = `${baseName}.webp`;
            const newPath = path.join(imgDir, newName);

            try {
                // Resize to max 1200w and convert to webp
                await sharp(filePath)
                    .resize({ width: 1200, withoutEnlargement: true })
                    .webp({ quality: 75 })
                    .toFile(newPath);
                
                mapping[file] = newName;
                console.log(`Converted ${file} to ${newName}`);
                // Delete original file to save space and force update
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
    return mapping;
}

function updateHTMLAndCSS(mapping) {
    console.log('Updating HTML and CSS files...');
    const files = fs.readdirSync(rootDir);
    
    // Add css/styles.css
    files.push('css/styles.css');

    for (const file of files) {
        if (!file.endsWith('.html') && !file.endsWith('.css')) continue;
        
        const filePath = path.join(rootDir, file);
        if (!fs.existsSync(filePath)) continue;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Replace image names
        for (const [oldName, newName] of Object.entries(mapping)) {
            const regex = new RegExp(`imagens/${oldName}`, 'g');
            if (regex.test(content)) {
                content = content.replace(regex, `imagens/${newName}`);
                modified = true;
            }
        }

        // Add loading="lazy" to <img> tags in HTML, if not present
        if (file.endsWith('.html')) {
            const imgRegex = /<img\s+(?![^>]*loading=["']lazy["'])((?:[^>](?!loading=))*?)>/gi;
            const newContent = content.replace(imgRegex, '<img $1 loading="lazy">');
            if (content !== newContent) {
                content = newContent;
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
}

async function run() {
    const mapping = await optimizeImages();
    updateHTMLAndCSS(mapping);
    console.log('Optimization complete!');
}

run();

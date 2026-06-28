const fs = require('fs');
const path = require('path');
const dir = 'c:\\Users\\thiag\\bellajeri_tour\\bellajeri_tour';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix the broken self-closing tag: "/ loading="lazy">" -> " loading="lazy" />"
        let newContent = content.replace(/\s*\/\s*loading="lazy">/g, ' loading="lazy" />');
        
        // Remove lazy loading from the logo to ensure it loads immediately
        newContent = newContent.replace(/<img([^>]+src="imagens\/bella_jeri_logo\.svg"[^>]*)loading="lazy"([^>]*)>/g, '<img$1$2>');
        
        // Remove lazy load from hero background (it's not an img tag, so it's fine, but just in case we have a top banner)
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed ${file}`);
        }
    }
});

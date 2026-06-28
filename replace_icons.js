const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\thiag\\bellajeri_tour\\bellajeri_tour';

const svgMap = {
    '🛫': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5 6.3 7.7l-1.6 1.6 5.8 3.5-3.5 3.5-3.4-.9-1.6 1.6 4.9 1.4 1.4 4.9 1.6-1.6-.9-3.4 3.5-3.5 3.5 5.8 1.6-1.6z"/></svg>',
    '🏨': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 22a5.36 5.36 0 0 0-5-5.43A5.36 5.36 0 0 0 5 22"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18"/><path d="M8 11h.01"/><path d="M8 7h.01"/></svg>',
    '📍': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    '🚙': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H5a2 2 0 0 0-1.6.8L1 11v5h2m16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/></svg>',
    '🏎️': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16m-8-4v8m-6 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
    '🛵': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="18" r="3"/><path d="M15 15H9l-2-4h8l2 4z"/><path d="M9 11v-2l4-2h3v4"/></svg>'
};

function removeEmojis(text) {
    let result = text;
    // Replace specific .dif-ico emojis with SVGs
    for (const [emoji, svg] of Object.entries(svgMap)) {
        result = result.replace(new RegExp(`<div class="dif-ico">${emoji}</div>`, 'g'), `<div class="dif-ico">${svg}</div>`);
    }

    // Now remove ALL remaining emojis across the entire file
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{1F170}-\u{1F251}\u{FE0F}]/gu;
    result = result.replace(emojiRegex, '');

    return result;
}

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const newContent = removeEmojis(content);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});

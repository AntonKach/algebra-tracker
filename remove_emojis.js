const fs = require('fs');
const files = ['index.html', 'script.js'];
const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF]|[\u2011-\u26FF]|\uD83E[\uDE00-\uDEFF])/g;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // We want to replace emojis with empty string. 
    // Also remove any stray spaces left behind.
    let newContent = content.replace(emojiRegex, '').replace(/  +/g, ' ');
    // For specific cases like "☁️ Σύνδεση" it will become " Σύνδεση" -> clean up spaces
    newContent = newContent.replace(/>\s+/g, '>').replace(/\s+</g, '<'); 
    
    // Actually just removing emojis and trim space
    // Let's be careful not to ruin HTML indentation.
    
    fs.writeFileSync(file, content.replace(emojiRegex, ''));
});
console.log("Emojis removed.");

const fs = require('fs');
const path = require('path');
const nextDir = 'C:\\Users\\fabricio\\Desktop\\RIFAZAP\\.next';

let foundText = "";

function searchNextCache(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchNextCache(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.json')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                // The exact line I inserted earlier
                if (content.includes('const [aspectRatio, setAspectRatio] =') && content.includes('Real Ticket Logic')) {
                    console.log('FOUND NEXTJS CACHE IN:', fullPath);
                    foundText = content;
                }
            } catch (e) {
                // Ignore binary/read errors
            }
        }
    }
}
searchNextCache(nextDir);
if (!foundText) console.log("Not found in Next.js cache.");
else {
    fs.writeFileSync('C:\\Users\\fabricio\\Desktop\\RIFAZAP\\scripts\\recovered_page.js', foundText);
    console.log("Saved to scripts/recovered_page.js!");
}

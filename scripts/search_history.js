const fs = require('fs');
const path = require('path');
const historyDir = 'C:\\Users\\fabricio\\AppData\\Roaming\\Code\\User\\History';

let foundAny = false;

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchFiles(fullPath);
        } else {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                // The exact line I inserted earlier
                if (content.includes('const [aspectRatio, setAspectRatio] = useState') && content.includes('Real Ticket Logic based on map')) {
                    console.log('FOUND PERFECT MATCH IN:', fullPath);
                    foundAny = true;
                }
            } catch (e) {
                // Ignore binary/read errors
            }
        }
    }
}
searchFiles(historyDir);
if (!foundAny) console.log("Not found.");

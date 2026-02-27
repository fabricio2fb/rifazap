const fs = require('fs');
const path = require('path');
const historyDir = 'C:\\Users\\fabricio\\AppData\\Roaming\\Code\\User\\History';

let newestFile = null;
let newestTime = 0;

function searchFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchFiles(fullPath);
        } else {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('export function RafflesList') && content.includes('EDITOR PRO')) {
                    const mtime = fs.statSync(fullPath).mtimeMs;
                    if (mtime > newestTime) {
                        newestTime = mtime;
                        newestFile = fullPath;
                    }
                }
            } catch (e) {
                // Ignore
            }
        }
    }
}
searchFiles(historyDir);
if (newestFile) {
    console.log("FOUND RafflesList.tsx in:", newestFile);
    fs.copyFileSync(newestFile, 'C:\\Users\\fabricio\\Desktop\\RIFAZAP\\scripts\\RafflesList_recovered.tsx');
    console.log("Copied to scripts/RafflesList_recovered.tsx");
} else {
    console.log("Not found in VS Code History.");
}

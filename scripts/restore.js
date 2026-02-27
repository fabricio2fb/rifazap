const cp = require('child_process');
const fs = require('fs');
try {
    const content = cp.execSync('git show HEAD:"src/app/admin/campanhas/[id]/editor/page.tsx"').toString();
    fs.writeFileSync('src/app/admin/campanhas/[id]/editor/page.tsx', content);
    console.log("Restored successfully from HEAD.");
} catch (e) {
    console.error(e);
}

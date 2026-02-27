const fs = require('fs');
const cp = require('child_process');

try {
    // Backup
    fs.copyFileSync('package.json', 'package.json.bak');
    fs.copyFileSync('package-lock.json', 'package-lock.json.bak');
    fs.copyFileSync('src/app/admin/layout.tsx', 'src_app_admin_layout.tsx.bak');

    // Restore all
    cp.execSync('git restore .', { stdio: 'inherit' });

    // Restore backups
    fs.copyFileSync('package.json.bak', 'package.json');
    fs.copyFileSync('package-lock.json.bak', 'package-lock.json');
    fs.copyFileSync('src_app_admin_layout.tsx.bak', 'src/app/admin/layout.tsx');
    console.log("Successfully restored page.tsx without losing other files!");
} catch (e) {
    console.error(e);
}

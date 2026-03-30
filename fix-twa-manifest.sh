#!/bin/bash
# Fix TWA manifest after bubblewrap update

TWA_MANIFEST="./android/twa-manifest.json"

echo "Fixing $TWA_MANIFEST..."

# Create a backup
cp "$TWA_MANIFEST" "$TWA_MANIFEST.bak"

# Fix the manifest using Node.js
node -e "
const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('$TWA_MANIFEST', 'utf8'));

// Fix display mode
manifest.display = 'fullscreen';
manifest.displayOverride = ['fullscreen'];

// Remove shortcut icons (they don't exist)
manifest.shortcuts = [];

// Fix URLs to include /Puff prefix
if (manifest.shareTarget && manifest.shareTarget.action) {
  manifest.shareTarget.action = manifest.shareTarget.action.replace(
    'https://jdebunt.github.io/share',
    'https://jdebunt.github.io/Puff/share'
  );
}

if (manifest.fullScopeUrl) {
  manifest.fullScopeUrl = 'https://jdebunt.github.io/Puff/';
}

// Fix shortcut URLs
manifest.shortcuts = manifest.shortcuts.map(s => ({
  name: s.name,
  shortName: s.shortName,
  url: s.url.includes('/Puff/') ? s.url : 'https://jdebunt.github.io/Puff/' + s.url.replace('https://jdebunt.github.io/', '')
}));

fs.writeFileSync('$TWA_MANIFEST', JSON.stringify(manifest, null, 2));
console.log('Manifest fixed successfully!');
"

echo "Done! You can now run: bubblewrap build"

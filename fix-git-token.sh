#!/bin/bash
node -e "
const fs = require('fs');
const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!token) { console.error('ERROR: GITHUB_PERSONAL_ACCESS_TOKEN not set'); process.exit(1); }
let cfg = fs.readFileSync('.git/config', 'utf8');
cfg = cfg.replace(/https:\/\/LordEnki7:[^@]+@github\.com/g, 'https://LordEnki7:' + token + '@github.com');
fs.writeFileSync('.git/config', cfg);
console.log('Remote URL updated successfully');
"
git push origin main

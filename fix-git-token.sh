#!/bin/bash
python3 -c "
import os, re
token = os.environ.get('GITHUB_PERSONAL_ACCESS_TOKEN', '')
if not token:
    print('ERROR: GITHUB_PERSONAL_ACCESS_TOKEN not set')
    exit(1)
cfg = open('.git/config').read()
cfg = re.sub(r'https://LordEnki7:[^@]+@github\.com', f'https://LordEnki7:{token}@github.com', cfg)
open('.git/config', 'w').write(cfg)
print('Remote URL updated successfully')
"
git push origin main

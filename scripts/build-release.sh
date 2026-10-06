#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
"${DOTNET_BIN:-dotnet}" build JMSFusion.csproj -c Release --nologo
python3 - <<'PY'
import hashlib, json, pathlib, zipfile
root = pathlib.Path('.')
meta = json.loads((root / 'meta.json').read_text())
version = meta['version']
output = root / 'dist_release' / f'NexusPobreFlix-{version}.zip'
output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.write(root / 'bin/Release/net10.0/Jellyfin.Plugin.JMSFusion.dll', 'Jellyfin.Plugin.JMSFusion.dll')
    archive.write(root / 'meta.json', 'meta.json')
    archive.write(root / 'img/nexus-pobreflix-logo.png', 'icon.png')
manifest_path = root / 'manifest.json'
manifest = json.loads(manifest_path.read_text())
entry = next(v for v in manifest[0]['versions'] if v['version'] == version)
entry['checksum'] = hashlib.md5(output.read_bytes()).hexdigest()
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
print(f'{output}: {entry["checksum"]}')
PY

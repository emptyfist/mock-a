from pathlib import Path
import re, subprocess, concurrent.futures

root = Path(__file__).resolve().parent.parent
assets = root / 'assets'
assets.mkdir(exist_ok=True)
downloads = {}
for reference in (root / 'design-reference').glob('*.tsx'):
    source = reference.read_text()
    prefix = re.search(r'assetPathPrefix = "([^"]+)"', source)[1]
    for name in re.findall(r'\$\{assetPathPrefix\}/([^`]+)', source):
        downloads[name] = prefix + '/' + name

def download(item):
    name, url = item
    target = assets / name
    if not target.exists() or target.stat().st_size == 0:
        subprocess.run(['curl', '--fail', '--location', '--silent', '--show-error', '--retry', '2', url, '--output', str(target)], check=True)
    if target.stat().st_size == 0:
        raise ValueError(f'Empty asset: {name}')
    return name

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(download, downloads.items()))
print(f'Downloaded {len(results)} original Figma assets.')

"""Validate reviewed source integrity and migrations; never access production."""
from pathlib import Path
import hashlib
import json
import re
import sqlite3
import subprocess

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'docs/source-manifest.json').read_text())
for project in manifest['projects']:
    base = ROOT / 'apps' / project['name']
    for entry in project['imported_files']:
        actual = hashlib.sha256((base / entry['path']).read_bytes()).hexdigest()
        assert actual == entry['sha256'], f"Source drift: {project['name']}/{entry['path']}"
    with sqlite3.connect(':memory:') as db:
        migrations = sorted((base / 'drizzle').glob('*.sql'))
        for migration in migrations:
            db.executescript(migration.read_text())
        count = db.execute("SELECT count(*) FROM sqlite_master WHERE type='table'").fetchone()[0]
        assert count == {'planejamento': 15, 'eleicoes': 14}[project['name']]
        print(f"{project['name']}: integrity OK; {len(migrations)} migrations; {count} tables")

# Defense in depth, not a guarantee that all possible secrets/PII are detected.
patterns = [r'rlkey\s*=', r'-----BEGIN [A-Z ]*PRIVATE KEY-----',
            r'gh[pousr]_[A-Za-z0-9]{20,}', r'https?://[^\s/@:]+:[^\s/@]+@',
            r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b']
tracked = subprocess.run(['git', 'ls-files', '-z'], cwd=ROOT, capture_output=True)
paths = [ROOT / p for p in tracked.stdout.decode().split('\0') if p] if tracked.returncode == 0 and tracked.stdout else [p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts]
for path in paths:
    assert not (path.name.startswith('.env') and path.name != '.env.example'), f'Private environment file: {path.relative_to(ROOT)}'
    content = path.read_text(encoding='utf-8')
    for pattern in patterns:
        assert not re.search(pattern, content), f'Potential sensitive content: {path.relative_to(ROOT)}'
print('Public-content pattern checks OK (limited heuristic scan).')

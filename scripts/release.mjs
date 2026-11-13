import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2];
const git = process.env.GIT_BIN
  || (fs.existsSync('C:\\Program Files\\Git\\cmd\\git.exe') ? 'C:\\Program Files\\Git\\cmd\\git.exe' : 'git');

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Usage: npm run release -- 1.0.5');
  process.exit(1);
}

const tag = `v${version}`;
const run = (args, opts = {}) => execFileSync(git, args, { cwd: root, stdio: 'inherit', ...opts });

run(['rev-parse', '--git-dir']);

try {
  run(['rev-parse', '--verify', `refs/tags/${tag}`], { stdio: 'ignore' });
  console.error(`Tag ${tag} already exists.`);
  process.exit(1);
} catch {
  // tag does not exist
}

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

execFileSync(process.execPath, ['scripts/build.mjs', '--version', version], {
  cwd: root,
  stdio: 'inherit'
});

run(['add', 'package.json', 'assets', 'src', 'scripts', '.github', 'README.md']);
run(['commit', '-m', `Release ${tag}`]);
run(['tag', '-a', tag, '-m', `Release ${tag}`]);
run(['push', 'origin', 'main']);
run(['push', 'origin', tag]);

console.log(`Released ${tag}. jsDelivr will serve the tag after GitHub propagates it.`);

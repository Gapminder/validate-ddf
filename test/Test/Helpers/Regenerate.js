import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

export const regenerateBadCsvFilesImpl = () => {
    const script = join(process.cwd(), 'test', 'datasets', 'ddf--test--bad-csv', 'create-test-files.mjs');
    execFileSync('node', [script], { stdio: 'pipe' });
};

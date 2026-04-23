/**
 * Generates the test CSV files for ddf--test--bad-csv.
 * Run once (or re-run to regenerate) from any directory:
 *   node test/datasets/ddf--test--bad-csv/create-test-files.mjs
 *
 * Files created:
 *   ddf--concepts.csv            — clean, well-formed (baseline)
 *   ddf--entities--geo.csv       — UTF-8 BOM prefix
 *   ddf--entities--geo--region.csv  — Windows CRLF line endings
 *   ddf--entities--geo--country.csv — invalid UTF-8 byte sequence (Latin-1 bytes)
 *   ddf--entities--geo--place.csv    — inconsistent column count
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const f = (name) => join(dir, name);

// ── 1. Clean concepts file ────────────────────────────────────────────────────
// Defines the entity domains referenced by the entity files below.
writeFileSync(
  f('ddf--concepts.csv'),
  'concept,concept_type,domain,name\ngeo,entity_domain,,Geo\nregion,entity_set,geo,Region\ncountry,entity_set,geo,Country\nplace,entity_set,geo,Place\nname,string,,Name\ndomain,string,,Domain\n',
  { encoding: 'utf8' }
);
console.log('✓ ddf--concepts.csv  (clean, LF, no BOM)');

// ── 2. UTF-8 BOM ──────────────────────────────────────────────────────────────
// 0xEF 0xBB 0xBF prepended to otherwise valid content.
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
const bomContent = Buffer.from('geo,name\ng01,Stockholm\ng02,Oslo\n', 'utf8');
writeFileSync(f('ddf--entities--geo.csv'), Buffer.concat([BOM, bomContent]));
console.log('✓ ddf--entities--geo.csv  (UTF-8 BOM)');

// ── 3. CRLF line endings ──────────────────────────────────────────────────────
// Every line terminated with \r\n instead of \n.
const crlfContent = 'region,name\r\nr01,North\r\nn02,South\r\n';
writeFileSync(f('ddf--entities--geo--region.csv'), crlfContent, { encoding: 'utf8' });
console.log('✓ ddf--entities--geo--region.csv  (CRLF line endings)');

// ── 4. Invalid UTF-8 encoding ─────────────────────────────────────────────────
// Header is valid UTF-8; second row contains 0xFF 0xFE (UTF-16 LE BOM bytes)
// which are illegal in a UTF-8 stream.
const validHeader = Buffer.from('country,name\n', 'utf8');  // header uses entity-set key column
const invalidRow  = Buffer.concat([
  Buffer.from('c01,', 'utf8'),
  Buffer.from([0xff, 0xfe]),          // invalid UTF-8 sequence
  Buffer.from('Sverige\n', 'utf8'),
]);
const cleanRow = Buffer.from('c02,Norway\n', 'utf8');
writeFileSync(f('ddf--entities--geo--country.csv'), Buffer.concat([validHeader, invalidRow, cleanRow]));
console.log('✓ ddf--entities--geo--country.csv  (invalid UTF-8 bytes)');

// ── 5. Inconsistent column count ─────────────────────────────────────────────
// Row 2 has 3 fields, row 3 has 1 field — header declares 2 columns.
// csv-parse with relax_column_count:true will parse this without throwing;
// the validator must detect the mismatch in validCsvRec.
const unevenContent = 'place,name\np01,North,extra\np02\n';
writeFileSync(f('ddf--entities--geo--place.csv'), unevenContent, { encoding: 'utf8' });
console.log('✓ ddf--entities--geo--place.csv  (inconsistent column count)');

console.log('\nAll test files written to', dir);

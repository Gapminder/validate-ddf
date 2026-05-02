import { parse } from 'csv-parse/sync';
import { readFile, readFileSync, writeFileSync } from 'node:fs';

const UTF8_BOM = [0xEF, 0xBB, 0xBF];

function hasBOM(buf) {
  return buf[0] === UTF8_BOM[0] && buf[1] === UTF8_BOM[1] && buf[2] === UTF8_BOM[2];
}

function isValidUTF8(buf) {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buf);
    return true;
  } catch (_) {
    return false;
  }
}

// parseCsvPlainImpl :: String -> Effect (Promise Foreign)
// Plain read + parse CSV — no format checks. Used by datapackage generation
// and other non-validation callers that don't need BOM/CRLF/UTF-8 detection.
export function parseCsvPlainImpl(path) {
  return function () {
    return new Promise((resolve, reject) => {
      readFile(path, { encoding: 'utf8' }, (err, content) => {
        if (err) reject(err);
        else resolve(parseCsvContent(content));
      });
    });
  };
}

// parseCsvImpl :: String -> Boolean -> Effect (Promise Foreign)
// Read + parse CSV with BOM/CRLF/UTF-8 format detection and optional fix.
// Used by the validation pipeline.
export function parseCsvImpl(path) {
  return function (fixFormat) {
    return function () {
      return new Promise((resolve, reject) => {
        // 1. Read file as buffer (async — yields the event loop so the HTTP
        //    server in the sidecar process can respond to progress polls
        //    between files, even during large dataset validation).
        readFile(path, (err, buf) => {
          if (err) { reject(err); return; }

          const formatIssues = [];

          // 2. Check format issues
          const bom = hasBOM(buf);
          if (bom) formatIssues.push('BOM');
          if (!isValidUTF8(buf)) formatIssues.push('ENCODING');

          // 3. Get content string (strip BOM if present)
          const content = (bom ? buf.slice(3) : buf).toString('utf8');
          if (content.includes('\r\n')) formatIssues.push('CRLF');

          // 4. Optionally fix and write back
          let contentToParse = content;
          if (fixFormat && formatIssues.length > 0) {
            if (formatIssues.includes('CRLF')) {
              contentToParse = contentToParse.replace(/\r\n/g, '\n');
            }
            // BOM already stripped above; ENCODING writes replacement chars per UTF-8 decode
            writeFileSync(path, contentToParse, { encoding: 'utf8' });
          }

          // 5. Parse CSV
          const parsed = parseCsvContent(contentToParse);
          resolve({ ...parsed, formatIssues });
        });
      });
    };
  };
}

// Shared: parse CSV string into column-oriented structure
function parseCsvContent(text) {
  const allRecords = parse(text, {
    quote: '"',
    columns: false,
    relax_column_count: true
  });

  const headers = allRecords.length > 0 ? allRecords[0] : [];
  const numColumns = headers.length;
  const records = Array(numColumns).fill().map(() => []);
  const badrows = [];
  const index = [];

  for (let i = 1; i < allRecords.length; i++) {
    const record = allRecords[i];
    // lineNumber: header is line 1 (i=0), first data row is line 2 (i=1)
    const lineNumber = i + 1;
    if (record.length !== numColumns) {
      badrows.push({ lineNo: lineNumber, expected: numColumns, actual: record.length });
    } else {
      index.push(lineNumber);
      for (let j = 0; j < numColumns; j++) {
        records[j].push(record[j]);
      }
    }
  }

  return {
    headers: headers,
    columns: records,
    index: index,
    badrows: badrows,
    formatIssues: []
  };
}

export function rowsToColumnsImpl(rows) {
  if (rows.length === 0) return [];

  const numColumns = rows[0].length;
  const columns = Array(numColumns).fill().map(() => []);

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < numColumns; j++) {
      var value = rows[i][j]
      if (typeof value === 'undefined') {
        columns[j].push('');
      }
      else {
        columns[j].push(rows[i][j]);
      }

    }
  }

  return columns;
}

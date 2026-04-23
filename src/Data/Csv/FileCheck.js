import { readFileSync, writeFileSync } from 'node:fs';

const UTF8_BOM = [0xEF, 0xBB, 0xBF];

function hasBOM(buf) {
    return buf[0] === UTF8_BOM[0] && buf[1] === UTF8_BOM[1] && buf[2] === UTF8_BOM[2];
}

function isValidUTF8(buf) {
    try {
        // TextDecoder with fatal:true throws on any invalid UTF-8 byte sequence
        new TextDecoder('utf-8', { fatal: true }).decode(buf);
        return true;
    } catch (_) {
        return false;
    }
}

// Returns an array of issue type strings: "BOM", "CRLF", "ENCODING" (empty = all OK).
export function checkFileFormatImpl(filepath) {
    const buf = readFileSync(filepath);
    const issues = [];

    const bom = hasBOM(buf);
    if (bom) {
        issues.push('BOM');
    }

    if (!isValidUTF8(buf)) {
        issues.push('ENCODING');
    }

    // Check CRLF on the actual content (after stripping BOM for the string check)
    const content = (bom ? buf.slice(3) : buf).toString('utf8');
    if (content.includes('\r\n')) {
        issues.push('CRLF');
    }

    return issues;
}

// Fixes: strips UTF-8 BOM and converts CRLF → LF. Writes back to disk.
export function fixFileFormatImpl(filepath) {
    const buf = readFileSync(filepath);
    const bom = hasBOM(buf);
    const content = (bom ? buf.slice(3) : buf).toString('utf8');
    const fixed = content.replace(/\r\n/g, '\n');
    writeFileSync(filepath, fixed, { encoding: 'utf8' });
}

import { parse } from 'csv-parse';
import fs from 'node:fs';


export function parseCsvImpl(path) {
  return function () {
    const func = async () => {
      const parser = fs
        .createReadStream(path, "utf8")
        .pipe(parse({
          bom: true,
          quote: '"',
          columns: false,
          relax_column_count: true
        }));
      let records;
      let headers;
      let numColumns;
      var count = -1;
      var badrows = [];
      var index = [];
      for await (const record of parser) {
        count++;
        if (count === 0) {
          headers = record;
          numColumns = headers.length;
          records = Array(numColumns).fill().map(() => []);
        } else {
          if (record.length !== numColumns) {
            badrows.push(count)
          } else {
            index.push(count)
            for (let i = 0; i < numColumns; i++) {
              records[i].push(record[i])
            }
          }
        }
      };
      return {
        headers: headers || [],
        columns: records || [],
        index: index || [],
        badrows: badrows
      };
    };
    return func()
  }
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

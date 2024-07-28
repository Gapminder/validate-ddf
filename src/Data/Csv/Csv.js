import { parse } from 'csv-parse';

export function parseCsvImpl(csvLine) {
  return function (onError, onSuccess) {
    parse(csvLine, {
        bom: true,
        quote: '"',
        columns: false,
        relax_column_count: true,
        // we will send all records (including bad ones) to purescript side.
        // uncomment below to skip the records that have different field numbers from headers.
        // but we need to adjust purescript types to handle line numbers correctly.
        // on_record: (record, { lines, error }) => {
        //     if (error) {
        //         console.log(`Warning: skipped row because ${error.message}`);
        //         return null
        //     } else {
        //         return { "line": lines, "record": record }
        //     }
        // }
    }, function(err, records) {
      if (err) {
        onError(err);
      }
      onSuccess(records);
    })

    return function (cancelError, onCancelerError, onCancelerSuccess) {
      onCancelerSuccess();
    };
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

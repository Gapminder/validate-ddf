import { parse } from 'csv-parse';


// fs.createReadStream(path.resolve(__dirname, 'assets', 'parse.csv'))
//     .pipe(csv.parse({ headers: true }))
//     .on('error', error => console.error(error))
//     .on('data', row => console.log(row))
//     .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));


export function parseCsvImpl(csvLine) {
  return function (onError, onSuccess) {
    parse(csvLine, {
        bom: true,
        quote: '"',
        columns: false,
        relax_column_count: true, // send all records to purescript side.
        // uncomment below to skip the records that have different field numbers from headers.
        // on_record: (record, { lines, error }) => {
        //     if (error) {
        //         console.log(`Warning: ${filepath}: skipped row because ${error.message}`);
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

// console.log(readCsvImpl("../../test/datasets/test1/ddf--concepts.csv"))

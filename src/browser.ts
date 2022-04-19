import { Buffer } from 'buffer';
import { parse } from 'csv-parse/browser/esm';
import split from 'split-string';

 
export type Record = {[x: string]: string};
export type Config = {
  csvString: string,
  sortColumn: number,
  stringifyOutput ? : boolean,
  reverse ? : boolean,
  sortWithHeader ? : boolean
}

export async function sort(config: {
  csvString: string,
  sortColumn: number,
  stringifyOutput ? : boolean,
  reverse ? : boolean,
  sortWithHeader ? : boolean
}, callback ? : (data: Array<Record> | string | null, err?: any) => void): Promise<Array<Record> | string> {

  if(callback){
    Promise.all([_sortCSV(config)]).then((values) => {
      callback(values[0]);
    }).catch(reason => {
      callback(null, reason);
    });
  }else{
    return Promise.all([_sortCSV(config)]).then((values) => {
      return values[0];
    }).catch(reason => {
      return reason;
    });
  }
}

function _sortCSV(config: Config) {
  return new Promise<Array<Record> | string>((resolve, reject) => {

        const firstLine = config.csvString.split('\n')[0];
        const delimiter = String.fromCharCode(recognizeDelimiter(Buffer.from(config.csvString, 'utf-8')));
        const splittedLine = split(firstLine, { quotes: ['"'], separator: delimiter });
  
        const columns: string[] = [];
        for (let i = 0; i < splittedLine.length; i++) {
          columns.push(`${i+1}`);
        }
  
        const records: Array<Record> = [];
  
        const parser = parse(config.csvString, { //pass csv without header into parser
          bom: true,
          columns: columns,
          delimiter: delimiter,
          ltrim: true,
          rtrim: true,
        });
  
        const first: Record = {};
  
        parser.on('readable', function(){
          let record: Record;
          while ((record = parser.read()) !== null) {
            if(Object.keys(first).length === 0  && !config.sortWithHeader){
              Object.assign(first,record);
            }else{
              records.push(record);
            }
          }
        });
  
        parser.on('end', function(){
          const sorted = records.sort((a :Record, b: Record) => {
            if (!config.reverse) {
                if(!isNaN(Number(a[config.sortColumn])) && !isNaN(Number(b[config.sortColumn]))){
                  return parseFloat(a[config.sortColumn]) - parseFloat(b[config.sortColumn]);
                } 
                  return a[config.sortColumn].localeCompare(b[config.sortColumn], undefined, {
                    numeric: true,
                    sensitivity: 'base'
                  });
              } else {
                if(!isNaN(Number(a[config.sortColumn])) && !isNaN(Number(b[config.sortColumn]))){
                  return parseFloat(b[config.sortColumn]) - parseFloat(a[config.sortColumn]);
                } 
                  return b[config.sortColumn].localeCompare(a[config.sortColumn], undefined, {
                    numeric: true,
                    sensitivity: 'base'
                  });
              }
          });
          !config.sortWithHeader && sorted.unshift(first);
          if(config.stringifyOutput){
            import('csv-stringify/browser/esm/sync').then((data) => {
              resolve(data.stringify(sorted));
            });
          } else resolve(sorted);
        });
  
        parser.on('error', function(err: any){
          return reject(err);
        });
  });
}

function recognizeDelimiter(fileBuffer: Buffer) {
  const delimiters = [',', ';', '|', '\t'];
  const index = delimiters
    .map(function (separator) {
      return fileBuffer.indexOf(separator);
    })
    .reduce(function (p, c) {
      return p === -1 || (c !== -1 && c < p) ? c : p;
    });
  return (fileBuffer[index] || 44);
}
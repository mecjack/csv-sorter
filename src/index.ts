import { parse } from 'csv-parse';
import fs, { PathLike } from 'fs';
import { argv, stdin, stdout} from 'process';
import split from 'split-string';
 
export type Record = {[x: string]: string};

export async function sort(config: {
  src: PathLike,
  csvString ?: undefined,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean,
  sortWithHeader ? : boolean
} | {
  src ?: undefined,
  csvString: string,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean,
  sortWithHeader ? : boolean
}, callback ? : (data: Array<Record> | null, err?: any) => void): Promise<Array<Record>> {

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

function _sortCSV(config: {
  src ? : PathLike,
  csvString ? : undefined,
  stdin ? : Buffer,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean,
  sortWithHeader ? : boolean,
  cli ? : boolean,
  stdout ? : boolean
} | {
  src ? : undefined,
  csvString ? : string,
  stdin ? : Buffer,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean,
  sortWithHeader ? : boolean,
  cli ? : boolean,
  stdout ? : boolean
}) {
  return new Promise<Array<Record>>((resolve, reject) => {

    config.stdin && fs.writeFileSync('tmp.csv', config.stdin);
    const file = config.stdin? 'tmp.csv': config.src? config.src: config.csvString;

      fs.readFile(file, (err, data) => {

        if(err && !config.csvString) return reject(err);
        const firstLine = !config.csvString? data.toString().split('\n')[0]: config.csvString.split('\n')[0];
        const delimiter = !config.csvString? String.fromCharCode(recognizeDelimiter(data)): String.fromCharCode(recognizeDelimiter(Buffer.from(config.csvString, 'utf-8')));
        const splittedLine = split(firstLine, { separator: delimiter, quotes: ['"'] });
  
        let columns: string[] = [];
        for (let i = 0; i < splittedLine.length; i++) {
          columns.push(`${i+1}`);
        }
  
        const records: Array<Record> = [];
  
        const parser = parse(!config.csvString? data: config.csvString, { //pass csv without header into parser
          bom: true,
          ltrim: true,
          rtrim: true,
          columns: columns,
          delimiter: delimiter,
        })
  
        let first: Record = {};
  
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
          let sorted = records.sort((a :Record, b: Record) => {
            if (!config.reverse) {
                if(!isNaN(Number(a[config.sortColumn])) && !isNaN(Number(b[config.sortColumn]))){
                  return parseFloat(a[config.sortColumn]) - parseFloat(b[config.sortColumn])
                } 
                  return a[config.sortColumn].localeCompare(b[config.sortColumn], undefined, {
                    numeric: true,
                    sensitivity: 'base'
                  })
              } else {
                if(!isNaN(Number(a[config.sortColumn])) && !isNaN(Number(b[config.sortColumn]))){
                  return parseFloat(b[config.sortColumn]) - parseFloat(a[config.sortColumn])
                } 
                  return b[config.sortColumn].localeCompare(a[config.sortColumn], undefined, {
                    numeric: true,
                    sensitivity: 'base'
                  })
              }
          })
          !config.sortWithHeader && sorted.unshift(first);
          config.dest || config.stdout? write(sorted, splittedLine.length, delimiter): !config.dest && !config.cli? resolve(sorted):null;
        });
  
        parser.on('error', function(err){
          return reject(err);
        });
      })

    function write(sorted: Array<Record>, length: number, delimiter: string) {
      try {
        sorted.forEach((elem, j) => {
          let line = ``;
          for (let i = 0; i < length; i++) {
            if (i === length - 1) {
              line += elem[i+1].includes(delimiter)? `"${elem[i+1]}"`: `${elem[i+1]}`;
            } else {
              line += elem[i+1].includes(delimiter)? `"${elem[i+1]}"${delimiter}`: `${elem[i+1]}${delimiter}`;
            }
          }
          if(sorted.length -1 > j) line += `\n`;
          config.dest && fs.appendFileSync(config.dest, line)
          config.stdout && process.stdout.write(line)
        });
        resolve(sorted);
      } catch (err) {
        return reject(err)
      }
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
  })
}

if(argv[0].includes('node') && !argv[1].includes('jest') && argv[2]){
  (async function(){
  const args = getArgs();
  const file = await read(stdin);
  if(args['c']==='' || (typeof args['c']==='boolean' || !/^\d+$/.test(args['c']))){
    stdout.write('sortColumn argument is not UInt\n');
  }else if(args['s']==='' || (typeof args['s']==='boolean') || (!fs.existsSync(args['s']) && !file.length)){
    stdout.write('Source file does not exist\n');
  }else if(file && file.length && args['s']){
    stdout.write('Two source files provided, which one to take?\n');
  }else if((typeof args['d']==='boolean') || args['d']===''){
    stdout.write('No destination file provided!\n');
  }else{
    _sortCSV({
      src: args['s']?args['s']:'',
      stdin: file && file.length?file:null,
      dest: args['d']? args['d']: null,
      sortColumn: parseInt(args['c']),
      reverse: args['R']? true: false,
      sortWithHeader: args['H']? true: false,
      cli: true,
      stdout: !args['d'] || args['O']
    })
  }
})()
}

async function read(stream: NodeJS.ReadStream & {
  fd: 0;
}){
  let str = '';
  if(stream.isTTY) return Buffer.from(str, 'utf-8'); 
  for await (const i of stream) {
    str+=i;
  }
  return Buffer.from(str, 'utf-8');
}

interface Args {
  'c'?: string | '' | true;
  's'?: string | '' | true;
  'd'?: string | '' | true;
  'H'?: true;
  'O'?: true;
  'R'?: true;
}

function getArgs (): Args {
  const args: Args = {};
  process.argv
      .slice(2, process.argv.length)
      .forEach( arg => {
      // params
      if (arg.slice(0,2) === '--') {
          const params = arg.split('=');
          const paramsFlag = params[0].slice(2,params[0].length);
          const paramsValue = params.length > 1 ? params[1] : true;
          args[paramsFlag as 'c' | 's' | 'd'] = paramsValue;
      }
      // options
      else if (arg[0] === '-') {
          const options = arg.slice(1,arg.length).split('');
          options.forEach(option => {
          args[option as 'H' | 'O' | 'R'] = true;
          });
      }
  });
  return args;
}
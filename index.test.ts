import {
  sort
} from './src/index'
import fs, {
  PathLike
} from 'fs';
import path from 'path'
import { exec, execFile, execSync } from 'child_process';
import process from 'process'
import { debuglog } from 'util';



//***  Put all your test CSV files in the test folder. Name them test1.csv to test[n].csv and run the tests with `npm run test`

const fields = [{ 6: 2 }, { 2: 37 }, { 1: 37 }, { 8: 4 }, { 12: 2 }, { 14: 8 }, { 16: 6 }, { 18: 7 }, { 17: 6 }, { 19: 7 }, { 24: 6 }, { 28: 9 }, { 22: 3 }, { 30: 10 }, { 27: 9 }, { 29: 10 }, { 31: 6 }, { 36: 5 }, { 34: 30 }, { 40: 10 }, { 37: 9 }, { 39: 4 }, { 13: 9 }, { 21: 22 }, { 26: 17 }, { 35: 5 }, { 38: 48 }, { 3: 37 }, { 7: 14 }, { 5: 8 }, { 25: 18 }, { 32: 24 }, { 33: 30 }, { 9: 7 }, { 11: 7 }, { 15: 21 }, { 20: 22 }, { 23: 18 }, { 4: 37 }, { 10: 13 } ]


beforeAll(() => {
  !fs.existsSync(path.join('res')) && fs.mkdirSync(path.join('res'))
  fs.readdir(path.join('res'), (err, files) => {
    if (err) throw err;

    //empty result folder
    for (const file of files) {
      fs.unlinkSync(path.join(path.join('res'), file));
    }
  })
  //Cli
  !fs.existsSync(path.join('res_cli')) && fs.mkdirSync(path.join('res_cli'))
  fs.readdir(path.join('res_cli'), (err, files) => {
    if (err) throw err;

    //empty result folder
    for (const file of files) {
      fs.unlinkSync(path.join('res_cli', file));
    }
  })
})

//--- all tests from test folder except last one which is for promise rejection test
test.concurrent.each([...Array(fs.readdirSync(path.join('test')).length-1)].map((_, index) => index + 1))('File %i', async (i) => {
  const col = getRandomIntInclusive(1, fields.filter((obj) => parseInt(Object.keys(obj)[0]) === i)[0][i]); //column to be sorted (random)
  const sortWithHeader = Math.random() < 0.5;
  const reverse = Math.random() < 0.5;
  const withSource = Math.random() < 0.5;
  const withDest = Math.random() < 0.5;
  const withStdout = Math.random() < 0.5;
  const firstLineSrc = fs.readFileSync(path.join('test', `test${i}.csv`)).toString().split('\n')[0]
  const withCallback = Math.random() < 0.5;

  //---JS
  console.log('withSource: ', withSource, 'src:', path.join('test', `test${i}.csv`), 'withDest: ', withDest, 'dest:', path.join('res', `res${i}.csv`), 'sortColumn:', col, 'reverse:', reverse, 'sortWithHeader:', sortWithHeader)
  
  let res = <any>[]
 
  if(withCallback){
    res = await SORT({src: path.join('test', `test${i}.csv`), dest: withDest? path.join('res', `res${i}.csv`):null, sortColumn: col, reverse: reverse, sortWithHeader: sortWithHeader})
  }else res = await sort({src: path.join('test', `test${i}.csv`), dest: withDest? path.join('res', `res${i}.csv`):null, sortColumn: col, reverse: reverse, sortWithHeader: sortWithHeader})
  if(withDest) expect(fs.statSync(path.join('res', `res${i}.csv`)).size).toBeGreaterThan(0)
  for(let k=0;k<res.length;k++){ //test if numbers are sorted
    res[k+1] && res[k+1][col] && res[k+2] && res[k+2][col] && !isNaN(res[k+1][col]) && !isNaN(res[k+2][col]) && !reverse && expect(parseFloat(res[k+1][col])).toBeLessThanOrEqual(parseFloat(res[k+2][col]))
    res[k+1] && res[k+1][col] && res[k+2] && res[k+2][col] && !isNaN(res[k+1][col]) && !isNaN(res[k+2][col]) && reverse && expect(parseFloat(res[k+1][col])).toBeGreaterThanOrEqual(parseFloat(res[k+2][col]))
  }


  const firstLineRes = withDest? fs.readFileSync(path.join('res', `res${i}.csv`)).toString().split('\n')[0]: undefined
  if(!sortWithHeader && withDest) expect(firstLineRes.replace(/"/g,'').replace(/\s/g,'')).toMatch(firstLineSrc.replace(/"/g,'').replace(/\s/g,''))
  withDest && expect(fs.readFileSync(path.join('res', `res${i}.csv`)).toString().split('\n').length).toBe(fs.readFileSync(path.join('test', `test${i}.csv`)).toString().split('\n').length)


  //---CLI
  const stdout = execSync(`${!withSource?`${process.platform == 'win32'? 'type': 'cat'} ${path.join('test', `test${i}.csv`)} | `:''}node ${path.join('lib', 'index.js')} ${withSource &&`--s=${path.join('test', `test${i}.csv`)}`} ${withDest && `--d=${path.join('res_cli', `res${i}.csv`)}`} --c=${col} -${reverse?'R':''}${sortWithHeader?'H':''}${withStdout?'O':''}`,{maxBuffer: 10 * 1000 * 1024})
  
  console.log(`${!withSource?`type ${path.join('test', `test${i}.csv`)} | `:''}node ${path.join('lib', 'index.js')} ${withSource &&`--s=${path.join('test', `test${i}.csv`)}`} ${withDest && `--d=${path.join('res_cli', `res${i}.csv`)}`} --c=${col} -${reverse?'R':''}${sortWithHeader?'H':''}${withStdout?'O':''}`)
  
  withStdout && expect(stdout.toString().length).toBeGreaterThan(0)
  withDest && expect(fs.statSync(path.join('res_cli', `res${i}.csv`)).size).toBeGreaterThan(0)
  const firstLineResCLI = withDest? fs.readFileSync(path.join('res_cli', `res${i}.csv`)).toString().split('\n')[0]: undefined
  if(!sortWithHeader && withDest) expect(firstLineResCLI.replace(/"/g,'').replace(/\s/g,'')).toMatch(firstLineSrc.replace(/"/g,'').replace(/\s/g,''))

  withDest && expect(fs.readFileSync(path.join('res_cli', `res${i}.csv`)).toString().split('\n').length).toBe(fs.readFileSync(path.join('test', `test${i}.csv`)).toString().split('\n').length)
  
  //---Both
  if(withDest){
    expect(fs.readFileSync(path.join('res', `res${i}.csv`))).toEqual(fs.readFileSync(path.join('res_cli', `res${i}.csv`)))
  }
},100000)


test('no source file', ()=>{

  const stdout = execSync(`node ${path.join('lib', 'index.js')} --d=${path.join('res_cli', `res99.csv`)} --c=1`)
  expect(stdout.toString()).toMatch('Source file does not exist');

})

test('sortColumn UInt', ()=>{

  const stdout = execSync(`node ${path.join('lib', 'index.js')} --s=${path.join('test', `test1.csv`)} --d=${path.join('res_cli', `res99.csv`)} --c=1.2`)
  expect(stdout.toString()).toMatch('sortColumn argument is not UInt');

})

test('two source files', ()=>{

  const stdout = execSync(`${process.platform == 'win32'? 'type': 'cat'} ${path.join('test', 'test2.csv')} | node ${path.join('lib', 'index.js')} --s=${path.join('test', `test1.csv`)} --d=${path.join('res_cli', `res98.csv`)} --c=1`)
  expect(stdout.toString()).toMatch('Two source files provided, which one to take?');

})

test('equal from callback and from promise', async ()=>{
  const resCB = await SORT({src: path.join('test', `test${1}.csv`), dest: path.join('res', `res${96}.csv`), sortColumn: 2});
  const resPR = await sort({src: path.join('test', `test${1}.csv`), dest: path.join('res', `res${97}.csv`), sortColumn: 2});
  expect(resCB).toEqual(resPR);
})

test('parse error handled', async ()=>{
  const res = await sort({src: path.join('test', `test${41}.csv`), dest: path.join('res', `res${41}.csv`), sortColumn: 2})
  expect(res['code']).toBe('CSV_RECORD_INCONSISTENT_COLUMNS');
})

test('parse error handled callback', ()=>{
  const x = sort({src: path.join('test', `test${41}.csv`), dest: path.join('res', `res${41}.csv`), sortColumn: 2}, (data, err)=>{
    expect(err['code']).toBe('CSV_RECORD_INCONSISTENT_COLUMNS');
  })
  expect(x).toBeFalsy; //function with callback returns undefined
})

test('write file error handled', async ()=>{
  fs.appendFileSync(path.join('res', `res${42}.csv`), '');
  fs.chmodSync(path.join('res', `res${42}.csv`), 0); 
  const res = await sort({src: path.join('test', `test${1}.csv`), dest: path.join('res', `res${42}.csv`), sortColumn: 2});
  expect(res['code']).toBe(process.platform == 'win32'? `EPERM`: `EACCES`);
})

test('async return value', async ()=>{
  const res = sort({src: path.join('test', `test${1}.csv`), dest: path.join('res', `res${43}.csv`), sortColumn: 2});
  expect(res).toBeFalsy; //when no await
})



function SORT(config: {
  src: PathLike,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean,
  sortWithHeader ? : boolean
}) {
  return new Promise<Object>((resolve, reject) => {
    sort({
      src: config.src,
      dest: config.dest,
      sortColumn: config.sortColumn,
      reverse: config.reverse,
      sortWithHeader: config.sortWithHeader
    }, (data, err) => {
      resolve(data);
    })
  })
}



function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
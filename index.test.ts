import {
  sort
} from './src/index'
import fs, {
  PathLike
} from 'fs';
import path from 'path'
import { execSync } from 'child_process';


//***  Put all your test CSV files in the ./test folder. Name them test1.csv to test[n].csv and run the tests with `npm run test`

const fields = [{
    6: 2
  },
  {
    2: 37
  },
  {
    1: 37
  },
  {
    8: 4
  },
  {
    12: 2
  },
  {
    14: 8
  },
  {
    16: 6
  },
  {
    18: 7
  },
  {
    17: 6
  },
  {
    19: 7
  },
  {
    24: 6
  },
  {
    28: 9
  },
  {
    22: 3
  },
  {
    30: 10
  },
  {
    27: 9
  },
  {
    29: 10
  },
  {
    31: 6
  },
  {
    36: 5
  },
  {
    34: 30
  },
  {
    40: 10
  },
  {
    37: 9
  },
  {
    39: 4
  },
  {
    13: 9
  },
  {
    21: 22
  },
  {
    26: 17
  },
  {
    35: 5
  },
  {
    38: 48
  },
  {
    3: 37
  },
  {
    7: 14
  },
  {
    5: 8
  },
  {
    25: 18
  },
  {
    32: 24
  },
  {
    33: 30
  },
  {
    9: 7
  },
  {
    11: 7
  },
  {
    15: 21
  },
  {
    20: 22
  },
  {
    23: 18
  },
  {
    4: 37
  },
  {
    10: 13
  }
]


beforeAll(() => {
  !fs.existsSync('./res') && fs.mkdirSync('./res')
  fs.readdir('./res', (err, files) => {
    if (err) throw err;

    //empty result folder
    for (const file of files) {
      fs.unlinkSync(path.join('./res', file));
    }
  })
  //Cli
  !fs.existsSync('./res_cli') && fs.mkdirSync('./res_cli')
  fs.readdir('./res_cli', (err, files) => {
    if (err) throw err;

    //empty result folder
    for (const file of files) {
      fs.unlinkSync(path.join('./res_cli', file));
    }
  })
})


test.concurrent.each([...Array(fs.readdirSync('./test').length)].map((_, index) => index + 1))('File %i', async (i) => {
  const col = getRandomIntInclusive(1, fields.filter((obj) => parseInt(Object.keys(obj)[0]) === i)[0][i]);
  const sortWithHeader = Math.random() < 0.5;
  const reverse = Math.random() < 0.5;
  const withSource = Math.random() < 0.5;
  const withDest = Math.random() < 0.5;
  const withStdout = Math.random() < 0.5;
  console.log('withSource: ', withSource, 'src:', `./test/test${i}.csv`, 'withDest: ', withDest, 'dest:', `./res/res${i}.csv`, 'sortColumn:', col, 'reverse:', reverse, 'sortWithHeader:', sortWithHeader)
  let res = <any>[]
  res = await SORT({src: `./test/test${i}.csv`, dest: withDest?`./res/res${i}.csv`:null, sortColumn: col, reverse: reverse, sortWithHeader: sortWithHeader})
  const stdout = execSync(`${!withSource?`cat ./test/test${i}.csv | `:''}node lib/index.js ${withSource &&`--s=./test/test${i}.csv`} ${withDest && `--d=./res_cli/res${i}.csv`} --c=${col} -${reverse?'R':''}${sortWithHeader?'H':''}${withStdout?'O':''}`)
  withStdout && expect(stdout.toString().length).toBeGreaterThan(0)
  withDest && expect(fs.statSync(`./res/res${i}.csv`).size).toBeGreaterThan(0)
  for(let k=0;k<res.length;k++){ //test if numbers are sorted
    res[k+1] && res[k+1][col] && res[k+2] && res[k+2][col] && !isNaN(res[k+1][col]) && !isNaN(res[k+2][col]) && !reverse && expect(parseFloat(res[k+1][col])).toBeLessThanOrEqual(parseFloat(res[k+2][col]))
    res[k+1] && res[k+1][col] && res[k+2] && res[k+2][col] && !isNaN(res[k+1][col]) && !isNaN(res[k+2][col]) && reverse && expect(parseFloat(res[k+1][col])).toBeGreaterThanOrEqual(parseFloat(res[k+2][col]))
  }
  const firstLineSrc = fs.readFileSync(`./test/test${i}.csv`).toString().split('\n')[0]
  const firstLineRes = withDest? fs.readFileSync(`./res/res${i}.csv`).toString().split('\n')[0]: undefined
  !sortWithHeader && withDest && expect(firstLineRes).toBe(firstLineSrc)
  withDest && expect(fs.readFileSync(`./res/res${i}.csv`).toString().split('\n').length).toBe(fs.readFileSync(`./test/test${i}.csv`).toString().split('\n').length)
  withDest && expect(fs.readFileSync(`./res/res${i}.csv`)).toEqual(fs.readFileSync(`./res_cli/res${i}.csv`))
},100000)



function SORT(config: {
  src: PathLike,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean,
  sortWithHeader ? : boolean
}) {
  return new Promise((resolve, reject) => {
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
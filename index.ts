import {sort} from './src/index'


for (let i = 1; i < 2; i++) {
    sort({src:`./test${i}.csv`,sortColumn: 2, dest: `res${i}.csv`, reverse: false, sortWithHeader: true},(data)=>{
        console.log('done',JSON.stringify(data))
    })   
}

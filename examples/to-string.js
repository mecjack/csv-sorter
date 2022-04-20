import { sort } from 'csv-sorter';

const config  = {
    src: './Source.csv',
    sortColumn: 1, //number of column to sort
    stringifyOutput: true //return a string instead of an array of records
};

sort(config, (result, err)=>{
    if(err) throw err;
    console.log(result); //csv string
});
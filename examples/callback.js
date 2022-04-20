import { sort } from 'csv-sorter';

const config  = {
    src: './Source.csv',
    sortColumn: 1, //number of column to sort
    reverse: false, //sort in revserse order
    sortWithHeader: false //sort including first header line
};

sort(config, (result, err)=>{
    if(err) throw err;
    console.log(result) //array of objects of sorted records for further manipulation
});


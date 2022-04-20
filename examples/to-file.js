import { sort } from 'csv-sorter';

const config  = {
    src: './Source.csv',
    dest: './Result.csv',
    sortColumn: 1, //number of column to sort
    reverse: false, //sort in revserse order
    sortWithHeader: false //sort including first header line
};

sort(config, (result, err)=>{
    if(err) throw err;
    //your sorted Result.csv file was successfully saved...
    console.log(result); //also ready is your array of sorted records for further manipulation
});
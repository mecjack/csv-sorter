const csv = require('csv-sorter');


const config  = {
    src: './Source.csv',
    sortColumn: 1,
    reverse: false,
};

csv.sort(config, (result)=>{
    console.log(JSON.stringify(result)); //array of objects of sorted records for further manipulation
});



//Or to a file:

const config  = {
    src: './Source.csv',
    dest: './Result.csv',
    sortColumn: 1,
    reverse: false,
    sortWithHeader: false
};

csv.sort(config, (result)=>{
    //use your sorted Result.csv file for whatever...
});
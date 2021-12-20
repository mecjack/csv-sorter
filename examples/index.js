const csv = require('csv-sorter');


const config  = {
    src: './Source.csv',
    sortColumn: 1, //number of column to sort
    reverse: false, //sort in revserse order
    sortWithHeader: false //sort including first header line
};

csv.sort(config, (result, err)=>{
    if(err) throw err;
    console.log(result) //array of objects of sorted records for further manipulation
});

/* Async await 😎 */

async function foo(){
    const result = await csv.sort(config);
    console.log(result); //array of objects of sorted records for further manipulation, or error
} 



//Or to a file:

const config  = {
    src: './Source.csv',
    dest: './Result.csv',
    sortColumn: 1, //number of column to sort
    reverse: false, //sort in revserse order
    sortWithHeader: false //sort including first header line
};

csv.sort(config, (result, err)=>{
    if(err) throw err;
    //your sorted Result.csv file was successfully saved...
    console.log(result); //also ready is your array of sorted records for further manipulation
});
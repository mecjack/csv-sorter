import { sort } from 'csv-sorter';

/* Async await 😎 */

async function foo(){

    const config  = {
        src: './Source.csv',
        sortColumn: 1, //number of column to sort
        reverse: false, //sort in revserse order
        sortWithHeader: false //sort including first header line
    };

    const result = await sort(config);
    console.log(result); //array of objects of sorted records for further manipulation, or error
} 

foo();


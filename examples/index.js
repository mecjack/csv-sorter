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

/* Async await 😎 */

async function foo(){
    const result = await sort(config);
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

sort(config, (result, err)=>{
    if(err) throw err;
    //your sorted Result.csv file was successfully saved...
    console.log(result); //also ready is your array of sorted records for further manipulation
});

//Or directly from a CSV string:

async function foo(){

    const config  = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`,
    dest: './Result.csv',
    sortColumn: 1,
    };

    const result = await sort(config);
    console.log(result); 
} 
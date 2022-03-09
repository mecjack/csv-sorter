# csv-sorter

## What's that?

Naturally sort your CSV files by a column of your choice with delimiter auto recognition.
Save the result into a new sorted .csv file or return an array of objects of sorted records for further manipulation.   
Or use it from the CLI!


## Usage:    

```js

const csv = require('csv-sorter');


const config  = {
    src: './Source.csv',
    sortColumn: 1, //number of column to sort
    reverse: false, //sort in revserse order
    sortWithHeader: false //sort including first header line
};

csv.sort(config, (result, err)=>{
    if(err) throw err;
    console.log(result); //array of objects of sorted records for further manipulation
});

/* Async await */  😎 

async function foo(){
    const result = await csv.sort(config);
    console.log(result); //array of sorted records for further manipulation, or error
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

    const result = await csv.sort(config);
    console.log(result); 
} 

```

## Or from CLI:

#### params:

--s path to source file\
--d path to destination file\
--c sortColumn  

#### options:

-H  sortWithHeader\
-O  stdout\
-R  reverse   
#### from file
`node ./node_modules/csv-sorter/lib/index.js --s=./Source.csv --d=./Dest.csv --c=1 -HOR`

#### example from stdin
`cat Source.csv | node ./node_modules/csv-sorter/lib/index.js --d=./Dest.csv --c=1 -HOR`



**Contributers welcome!**

 
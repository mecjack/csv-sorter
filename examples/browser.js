import { sort } from 'csv-sorter/browser/umd'; //browser environment 

//in the browser, the input always comes from a csvString
async function foo(){

    const config  = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`, //required
    sortColumn: 1, //required
    stringifyOutput: true, //optional
    reverse: false, //optional
    sortWithHeader: false //optional
    };

    const result = await sort(config);
    console.log(result); 
} 

foo();

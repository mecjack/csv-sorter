import { sort } from 'csv-sorter';

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

foo();
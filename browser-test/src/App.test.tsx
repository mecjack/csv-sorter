import { render, screen, waitFor } from '@testing-library/react';
import App from './App';



test('renders sorted data with async await', async () => {
  const config = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`,
    sortColumn: 1,
    }

  render(<App {...{...config, withCallback: false}}/>);
  await waitFor(()=>expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('[{"1":"a","2":"b","3":"c","4":"d","5":"e","6":"f","7":"g"},{"1":"1","2":"4","3":"2","4":"2","5":"1","6":"1.0","7":"F"},{"1":"2","2":"2","3":"4","4":"4","5":"5","6":"2.0","7":"F"},{"1":"3","2":"1","3":"5","4":"4","5":"5","6":"2","7":"F"},{"1":"4","2":"3","3":"3","4":"3","5":"3","6":"3.0","7":"F"}]'), {timeout: 500});
});

test('renders sorted data with callback', async () => {
  const config  = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`,
    sortColumn: 1
    };
  render(<App {...{...config, withCallback: true}}/>);
  await waitFor(()=>expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('[{"1":"a","2":"b","3":"c","4":"d","5":"e","6":"f","7":"g"},{"1":"1","2":"4","3":"2","4":"2","5":"1","6":"1.0","7":"F"},{"1":"2","2":"2","3":"4","4":"4","5":"5","6":"2.0","7":"F"},{"1":"3","2":"1","3":"5","4":"4","5":"5","6":"2","7":"F"},{"1":"4","2":"3","3":"3","4":"3","5":"3","6":"3.0","7":"F"}]'), {timeout: 500});
});

test('renders reverse', async () => {
  const config  = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`,
    sortColumn: 1,
    reverse: true
    }
  render(<App {...{...config, withCallback: false}}/>);
  await waitFor(()=>expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('[{"1":"a","2":"b","3":"c","4":"d","5":"e","6":"f","7":"g"},{"1":"4","2":"3","3":"3","4":"3","5":"3","6":"3.0","7":"F"},{"1":"3","2":"1","3":"5","4":"4","5":"5","6":"2","7":"F"},{"1":"2","2":"2","3":"4","4":"4","5":"5","6":"2.0","7":"F"},{"1":"1","2":"4","3":"2","4":"2","5":"1","6":"1.0","7":"F"}]'), {timeout: 500});
});

test('sorts with header', async () => {
  const config  = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`,
    sortColumn: 1,
    sortWithHeader: true
    };

  render(<App {...{...config, withCallback: false}}/>);
  await waitFor(()=>expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('[{"1":"1","2":"4","3":"2","4":"2","5":"1","6":"1.0","7":"F"},{"1":"2","2":"2","3":"4","4":"4","5":"5","6":"2.0","7":"F"},{"1":"3","2":"1","3":"5","4":"4","5":"5","6":"2","7":"F"},{"1":"4","2":"3","3":"3","4":"3","5":"3","6":"3.0","7":"F"},{"1":"a","2":"b","3":"c","4":"d","5":"e","6":"f","7":"g"}]'), {timeout: 500});
});

test('stringifies output', async () => {
  const config  = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`,
    sortColumn: 1,
    stringifyOutput: true
  };
  render(<App {...{...config, withCallback: false}}/>);
  await waitFor(()=>expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('a,b,c,d,e,f,g\\n1,4,2,2,1,1.0,F\\n2,2,4,4,5,2.0,F\\n3,1,5,4,5,2,F\\n4,3,3,3,3,3.0,F\\n'), {timeout: 500});
});

test('stringifies output using callback', async () => {
  const config  = {
    csvString: 
    `a,"b","c","d","e",f,"g"
    3,"1","5","4","5",2,"F"
    2,"2","4","4","5",2.0,"F"
    4,"3","3","3","3",3.0,"F"
    1,"4","2","2","1",1.0,"F"`,
    sortColumn: 1,
    stringifyOutput: true
  };
  render(<App {...{...config, withCallback: true}}/>);
  await waitFor(()=>expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('a,b,c,d,e,f,g\\n1,4,2,2,1,1.0,F\\n2,2,4,4,5,2.0,F\\n3,1,5,4,5,2,F\\n4,3,3,3,3,3.0,F\\n'), {timeout: 500});
});
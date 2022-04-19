import React, { useEffect, useState } from 'react';
import './App.css';
import { sort, Config } from 'csv-sorter/browser/umd';


function App(config: Config, withCallback: boolean) {

  const [csv, setCsv] = useState('');


  useEffect(() => {
    if(!withCallback) {
      (async function () {
      
        const result = await sort(config);
        setCsv(JSON.stringify(result));
  })();
    }else{
      (async function () {
    
        sort(config, (result) => {
          setCsv(JSON.stringify(result))
        });
  })();
    }


  }, [config, withCallback]);
  
  return (
    <div className="App">
      <header className="App-header">
      <h1>{csv}</h1>
      </header>
    </div>
  );
}

export default App;

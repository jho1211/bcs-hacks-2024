import React, {useState} from 'react';
import GroceryList from './components/GroceryList';
import './App.css';

function App() {
  const data = ['A', 'B', 'C'];

  const [item, setItem] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <select className="select-box" onChange={(e) => setItem(e.target.value)} >
          {data.map((e) => <option className="option-item">{e}</option>)}
        </select>
        <GroceryList data={item}/>
       
      </header>
    </div>
  );
}

export default App;

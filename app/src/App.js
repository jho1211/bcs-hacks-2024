import React, {useState} from 'react';
import GroceryList from './components/GroceryList';
import './App.css';

function App() {
  const data = ['A', 'B', 'C'];

  const [item, setItem] = useState('');
  const [grocery, setGrocery] = useState([]);

  function handleGroceryItems() {
    console.log(item);
    console.log(typeof item);
    if (grocery.includes(item) || item === '') {
      setItem('');
    } else {
    const updatedList = grocery.concat(item);
    setGrocery(updatedList);
    console.log(updatedList);
    setItem('');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <select onChange={(e) => setItem(e.target.value)} >
          {data.map((e) => <option>{e}</option>)}
        </select>
        <GroceryList data={grocery}/>
        <button onClick={handleGroceryItems}>
          Add Items
        </button>
       
      </header>
    </div>
  );
}

export default App;

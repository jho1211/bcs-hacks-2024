import React from 'react';
import './App.css';
// import GroceryList from './components/GroceryList';
import Dropdown from './components/Dropdown';

function App() {


  // const [grocery, setGrocery] = useState([]);
  // const [input, setInput] = useState('');

  // function handleClick() {
  //   // get the value 
  //   const updatedList = grocery.concat(input);
  //   // add value to grocerylist 
  //   setGrocery(updatedList);
  //   // clear value 
  //   setInput('');
  // }

  return (
    <div className="App">
      <header className="App-header">
        {/* <GroceryList data  ={grocery}/> */}
        <Dropdown/>
        {/* <input value={input} onChange={(e) => setInput(e.target.value)}
        ></input> */}
        {/* <button onClick={handleClick}>
          Add to list
        </button> */}
      </header>
    </div>
  );
}


export default App;

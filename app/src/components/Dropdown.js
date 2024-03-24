import React, {useState} from "react";
import GroceryList from "./GroceryList";

function Dropdown() {
    const data = ["A", "B","C"];
    const [grocery, setGrocery] = useState([]);
    const [input, setInput] = useState('');

    function handleClick() {
        // get the value 
        const updatedList = grocery.concat(input);
        // add value to grocerylist 
        setGrocery(updatedList);
        // clear value 
        setInput('');
      }
    

    return (
        <div>
            <header>
            <input list="data" onChange={(e) => setInput(e.target.value)}placeholder="Search: "/>
            <datalist id="data">
                {data.map((e) => <option value={input}>{e}</option>)}
            </datalist> 
            <GroceryList data={input}/>

            <button onClick={handleClick}>
                Add to list
            </button>
            </header>
        </div>
    )
}

export default Dropdown;
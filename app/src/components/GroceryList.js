import React, {memo, useState} from "react";

const GroceryList = memo(function GroceryList({data}) {

    const [grocery, setGrocery] = useState([]);

    console.log(data);
    console.log(typeof data);

    function handleAddGrocery() {
        if (grocery.includes(data) || data === '') {
            return;

        } else {
            const updatedList = grocery.concat(data);
            setGrocery(updatedList);
            console.log(updatedList);
        }
    }

    function handleRemoveGrocery(index) {
        const updatedList = grocery.filter((_, i) => i !== index);
        setGrocery(updatedList);
    }

    console.log(grocery);
    
    return (
        <div className="grocery-list">
            <div>
                {grocery && grocery.length > 0 && (
                <ul>
                    {grocery.map((item,index) => {
                        return <li key={index}>
                            <span>{item}</span>
                            <button className="delete-button" onClick={() => handleRemoveGrocery(index)}>Delete item </button>
                        </li>
                    } )}
                </ul>
                )}
                <button className="add-button" onClick={handleAddGrocery}>
                    Add Items
                </button>
            </div>
        </div>
    )
});

export default GroceryList;
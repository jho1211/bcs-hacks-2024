import React from "react"
import { useNavigate } from "react-router-dom";

function generateDatalistItems() {
    const items_list = ["Eggs", "Milk", "Bread", "Chicken breast", "Ground beef", "Rice", "Pasta", 
    "Apple", "Banana", "Orange", "Potato", "Cracker", "Lettuce", 
    "Cheese", "Yogurt", "Peanut butter", "Cereal", "Chips", "Coffee", "Canola oil"]
    const groceryDataList = document.getElementById("groceryItemsList");

    if (groceryDataList.options.length != 0) {
        return;
    }

    items_list.forEach((item) => {
        var option = document.createElement("option");
        option.value = item;
        groceryDataList.appendChild(option);
    })
}

const Home = (props) => {
    const { loggedIn, profileID, items } = props;
    const navigate = useNavigate();
    var choice = "";

    const onButtonClick = () => {
        if (loggedIn) {
            // Implement PUT to store profileID and item list to database
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }

    const updateGroceryItemChoice = (e) => {
        
        generateDatalistItems();
        choice = e.target.value;
    }

    const addGroceryItemToList = () => {
        const itemToAdd = choice;
        if (loggedIn) {
            fetch(`https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/users`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"id": profileID, "item": itemToAdd})
            })
            .then((response) => console.log(response))
            .catch(err => console.log(err))
        }
    }

    // If you prefer more compact code, you can use the conditional ? operator. Unlike if, it works inside JSX:
    // Reference: https://react.dev/learn
    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Grocery Store Price Tracker</div>
        </div>
        <div>
            {loggedIn ? `Current profile ID: ${profileID}` : 'Powered by React.'}
        </div>
        <br />
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out and Save" : "Continue"} />
            {(loggedIn ?
                    <div>
                        {(
                            <div id="tableDiv">
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Item Name</th>
                                        <th scope="col">Store</th>
                                        <th scope="col">Average Price</th>
                                    </tr>
                                </thead>
                                <tbody id="itemsTableBody">
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2"><b>Total Price:</b></td>
                                        <td id="totalPriceCell">$0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div>
                                <label htmlFor="grocery-list-choice">Add a New Item:</label>
                                <input 
                                list="groceryItemsList" 
                                id="grocery-list-choice" 
                                name="grocery-list-choice" 
                                placeholder="Select an item"
                                onChange={updateGroceryItemChoice} />
                    
                                <datalist id="groceryItemsList" />
                                <input
                                    className={"inputButton"}
                                    type="button"
                                    onClick={addGroceryItemToList}
                                    value={"Add Item"} />
                            </div>
                            </div>
                        )}
                    </div>
                    :
                    <div/>
            )}
        </div>
    </div>;
}

export default Home
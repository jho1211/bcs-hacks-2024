import React from "react"
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const { loggedIn, profileID, items } = props;
    const navigate = useNavigate();

    const onButtonClick = () => {
        if (loggedIn) {
            // Implement PUT to store profileID and item list to database
            props.setLoggedIn(false)
        } else {
            navigate("/login")
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
                        {items.length > 0 && (
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
                                <input list="groceryItems" id="grocery-list-choice" name="grocery-list-choice" 
                                placeholder="Select an item" />
                    
                                <datalist id="groceryItems">
                                </datalist>
                    
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
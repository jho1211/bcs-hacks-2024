import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function fetchGroceryItemPrices(data) {
    if (data.length == 0) {
        return;
    }
    
    let url = "https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/prices?";
    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            url = url + "input=" + data[i];
        } else {
            url = url + "&input=" + data[i];
        }
    }
    fetch(url)
    .then(resp => resp.json())
    .then(data => handleResponse(data))
    .catch(err => {
        console.log("There was an error while fetching prices: ", err);
    })
}

function handleResponse(response) {
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var items = response[i];
        if (items.length == 0) {
            continue;
        }
        const save_on_items = items.filter((item) => item.store === "Save on Foods");
        const no_frills_items = items.filter((item) => item.store === "No Frills");
    
        let save_on_price = averagePrice(save_on_items);
        let no_frills_price = averagePrice(no_frills_items);
    
        if (save_on_price >= no_frills_price) {
            insertRow({"name": items[0].input_name, "price": save_on_price, "store": "Save on Foods"});
        } else {
            insertRow({"name": items[0].input_name, "price": no_frills_price, "store": "No Frills"});
        }
    }
    console.log("Item prices were read successfully");
}

function averagePrice(items) {
    let sum = 0;
    for (var i = 0; i < items.length; i++) {
        let price = items[i].price
        
        if (price != undefined) {
            price = parseFloat(price.substring(1));
        } else {
            price = items[i].price_per_unit;
            price = parseFloat(price);
        }

        sum += price;
    }
    if (items.length == 0) {
        return 0;
    } else {
        return Math.round(sum / items.length * 100) / 100;
    }
}

function insertRow(item) {
    const newRow = document.createElement("tr");
    const newCell = newRow.insertCell(-1);
    newCell.innerText = item["name"];
    const newCell2 = newRow.insertCell(-1);
    newCell2.innerText = item["store"];
    const newCell3 = newRow.insertCell(-1);
    newCell3.innerText = "$" + item["price"];
    const tbody = document.getElementById("itemsTableBody");
    tbody.append(newRow);

    recalculateTotal(item["price"]);
}

function recalculateTotal(price) {
    const totalPriceCell = document.getElementById("totalPriceCell");
    let curPrice = parseFloat(totalPriceCell.innerText.substring(1));
    curPrice += price;
    curPrice = Math.round(curPrice * 100) / 100
    totalPriceCell.innerText = "$" + curPrice;
}

const Login = (props) => {
    const [profileID, setProfileID] = useState("");
    const [profileIDError, setProfileIDError] = useState("");
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const CreateAccount = (profileID) => {
        const body = JSON.stringify({"id": profileID})
        console.log(body);
        fetch("https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/users", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: body
        })
            .then(response => {
                if (response.ok) {
                    props.setLoggedIn(true);
                    props.setProfileID(profileID);
                    props.setItems([]);
                }
            })
            .catch(error => {
                console.error(error);
                // callback(false);
            });
        // props.setItems([]);
        // props.setLoggedIn(true);
        // props.setProfileID(profileID);
        navigate("/");
    };

    const onButtonClickLogIn = () => {
        setProfileIDError("");
        if ("" === profileID) {
            setProfileIDError("Please enter your profile ID if it exists");
            return;
        } else if (!/^\d+$/.test(profileID)) {
            setProfileIDError("Profile ID should contain numbers only");
            return;
        }

        console.log("Before Checking if account exists");
        checkAccountExists(accountExists => {
            if (accountExists) {
                navigate("/");
            } else {
                if (window.confirm("An account does not exist with this ID: " + profileID + ". " +
                    "Would you like to make a new profile with the inputted number?")) {
                    CreateAccount(profileID);
                }
            }
        });
    };

    const checkAccountExists = (callback) => {
        fetch(`https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/users?id=${profileID}`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('ProfileID nonexistent');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.items);
                props.setLoggedIn(true);
                props.setProfileID(profileID);
                props.setItems(data.items);
                fetchGroceryItemPrices(data.items);
                callback(true);
            })
            .then(() => {
                fetchGroceryItemPrices(items);
            })
            .catch(error => {
                console.error(error);
                callback(false);
            });
    };

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Get Started</div>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={profileID}
                placeholder="Enter your Profile ID here"
                onChange={ev => setProfileID(ev.target.value)}
                className={"inputBox"} />
            {/*<br />*/}
            <label className="errorLabel">{profileIDError}</label>
        </div>
        <br />
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClickLogIn}
                value={"Log in with / Create ID"} />
        </div>
    </div>
}

export default Login
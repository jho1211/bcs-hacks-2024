import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [profileID, setProfileID] = useState("");
    const [profileIDError, setProfileIDError] = useState("");
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const CreateAccount = () => {
        const profileID = 10;
        // Do random number generator here while checking if unique ID from database
        props.setLoggedIn(true);
        props.setProfileID(profileID);
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
                if (window.confirm("An account does not exist with this ID: " + profileID + ". Would you like to make a new profile?")) {
                    CreateAccount();
                }
            }
        });
    };

    const checkAccountExists = (callback) => {
        const proxyUrl = 'https://cors.bridged.cc/';
        const apiUrl = `https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/users?id=${profileID}`;

        fetch(proxyUrl + apiUrl, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.items);
                props.setLoggedIn(true);
                props.setProfileID(profileID);
                props.setItems(items);
                callback(data?.items);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                callback(false);
            });
    };

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Enter Profile ID</div>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={profileID}
                placeholder="Enter your ID here"
                onChange={ev => setProfileID(ev.target.value)}
                className={"inputBox"} />
            {/*<br />*/}
            <label className="errorLabel">{profileIDError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClickLogIn}
                value={"Log in with ID"} />
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={CreateAccount}
                value={"Create New ID"} />
        </div>
    </div>
}

export default Login
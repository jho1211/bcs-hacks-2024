import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [profileID, setProfileID] = useState("");
    const [profileIDError, setProfileIDError] = useState("");
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const CreateAccount = (profileID) => {
        props.setItems([]);
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
                if (window.confirm("An account does not exist with this ID: " + profileID + ". " +
                    "Would you like to make a new profile with the given number?")) {
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
                callback(true);
            })
            .catch(error => {
                console.error(error);
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
    </div>
}

export default Login
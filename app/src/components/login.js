import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [profileID, setProfileID] = useState("");
    const [profileIDError, setProfileIDError] = useState("");
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

        checkAccountExists(accountExists => {
            if (accountExists) {
                logIn();
            } else {
                if (window.confirm("An account does not exist with this ID: " + profileID + ". Would you like to make a new profile?")) {
                    CreateAccount();
                }
            }
        });
    };

    const checkAccountExists = (callback) => {
        fetch("https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/users", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({profileID})
        })
            .then(response => response.json())
            .then(response => {
                callback(response?.userExists)
            })
    };

    const logIn = () => {
        fetch("https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/users", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({profileID})
        })
            .then(response => response.json())
            .then(response => {
                if ('success' === response.message) {
                    // Fetch the grocery list from database under profile ID and set it to the list here on the app
                    // localStorage.setItem("user", JSON.stringify({profileID, token: r.token}))
                    props.setLoggedIn(true);
                    props.setProfileID(profileID);
                    navigate("/");
                }
            })
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
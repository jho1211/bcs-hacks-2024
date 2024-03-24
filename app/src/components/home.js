import React from "react"
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const { loggedIn, profileID } = props;
    const navigate = useNavigate();

    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }

    // If you prefer more compact code, you can use the conditional ? operator. Unlike if, it works inside JSX:
    // Reference: https://react.dev/learn
    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome to the grocery list tracker app!</div>
        </div>
        <div>
            Powered by React.
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out" : "Log in"} />
            {(loggedIn ? <div>
                Your profile ID is {profileID}
            </div> : <div/>)}
        </div>
    </div>
}

export default Home
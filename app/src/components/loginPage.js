import React, {useState} from "react";
import logo from "../logo.svg";

export function LoginPage({onLogin}) {
    const [profileId, setProfileId] = useState('');

    const handleSubmit = (e) => {
        onLogin(profileId);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Enter your profile ID to access the next page.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Profile ID"
                        value={profileId}
                        onChange={(e) => setProfileId(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            </header>
        </div>
    );
}
import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Login from './components/login';

function App() {
    const [profileID, setProfileID] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)
    const [items, setItems] = useState(["Hello World"]);

    useEffect(() => {
        // Fetch the profileID and token from local storage
        const profile = JSON.parse(localStorage.getItem("profile"))

        // If the token/profileID does not exist, mark the profile as logged out
        if (!profile || !profile.token) {
            setLoggedIn(false)
            return
        }

        fetch("https://ozfhk0stlj.execute-api.us-west-2.amazonaws.com/dev/users", {
            method: "POST",
            headers: {
                'jwt-token': profile.token
            }
        })
            .then(r => r.json())
            .then(r => {
                setLoggedIn('success' === r.message)
                setProfileID(profile.ID || "")
            })
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Home profileID={profileID} loggedIn={loggedIn} items={items} setLoggedIn={setLoggedIn}/>} />
                    <Route
                        path="/login"
                        element={<Login setLoggedIn={setLoggedIn} setProfileID={setProfileID} setItems={setItems} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
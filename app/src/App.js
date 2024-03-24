import React, {useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Login from './components/login';
import logo from './logo.svg';

function App() {
    const [profileID, setProfileID] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)
    const [items, setItems] = useState([]);

    return (
        <div className="App">
            <header className="App-header">
                {!loggedIn && <img src={logo} className="App-logo" alt="logo" />}
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
            </header>
        </div>
    );
}

export default App;
import React, {useState} from 'react';
import './App.css';
import {ProfilePage} from "./components/profilePage";
import {LoginPage} from "./components/loginPage";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [profileId, setProfileId] = useState('');

    const handleLogin = (id) => {
        setProfileId(id);

        // Implement to backend to create a profileID if not made yet,
        // otherwise, fetch the data stored in existing profileID inputted

        setLoggedIn(true);
    };

    // If you prefer more compact code, you can use the conditional ? operator. Unlike if, it works inside JSX:
    return (
        <div>
            {loggedIn ? (
                <ProfilePage profileId={profileId} />
            ) : (
                <LoginPage onLogin={handleLogin} />

            )}
        </div>
    );

// function App() {
//     const [userId, setUserId] = useState('');
//
//     return (
//         <div>
//             <h1>Enter Your User ID</h1>
//             {/*<form onSubmit={handleSubmit}>*/}
//                 <input
//                     type="text"
//                     placeholder="User ID"
//                     value={userId}
//                     // onChange={handleChange}
//                 />
//                 <button type="submit">Proceed</button>
//             {/*</form>*/}
//         </div>
//     );



  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;

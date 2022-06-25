import '.styles/styles.css';
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <body>
    {isLoggedIn &&<Login setIsLoggedIn={setIsLoggedIn} />}
    {isLoggedIn &&<Signup />}
    {!isLoggedIn &&<Home />}
    </body>
  );
}
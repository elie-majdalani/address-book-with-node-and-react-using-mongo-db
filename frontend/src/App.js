import '.styles/styles.css';
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login,setLogin] = useState(true);
  return (
    <body>
      {console.log(isLoggedIn)}
    {!isLoggedIn && login && <Login setIsLoggedIn={setIsLoggedIn} setLogin={setLogin} />}
    {!isLoggedIn && !login &&<Signup setLogin={setLogin}/>}
    {isLoggedIn &&<Home setIsLoggedIn={setIsLoggedIn}/>}
    </body>
  );
}

export default App;
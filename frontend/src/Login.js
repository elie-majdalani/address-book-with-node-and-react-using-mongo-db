import '.styles/styles.css';
import { useState, useEffect } from 'react';


function Login( {setIsLoggedIn} ) {
    //check if token valid on refresh
    const token = localStorage.getItem('token');
    debugger
    useEffect(() => {
        debugger
        if (token) {
            setIsLoggedIn(true);
        }
    }, [])
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async () => {

        try {
            const res = await fetch("http://127.0.0.1:3001/signin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="login">
            <div className="login-form">
                <h1>Login</h1>
                <input type="text" placeholder="Username" onBlur={(e) => { setUsername(e.currentTarget.value) }} />
                <input type="password" placeholder="Password" onBlur={(e) => { setPassword(e.currentTarget.value) }} />
                <button onClick={loginUser} >Login</button>
            </div>
        </div>
    );
}

export default Login;
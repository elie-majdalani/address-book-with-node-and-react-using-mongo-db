import './styles/styles.css';
import { useState } from 'react';

const Signup = ({ setLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //  switch between pages
    const switchPage = () => {
        setLogin(true);
    }

    const signupUser = async () => {
        try {
            const res = await fetch("http://127.0.0.1:3001/signup", {
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
            if (res.status === 200) {
                switchPage();
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="signup">
            <div className="signup-form">
                <h1>Signup</h1>
                <input type="text" placeholder="Username" onBlur={(e) => { setUsername(e.currentTarget.value) }} />
                <input type="password" placeholder="Password" onBlur={(e) => { setPassword(e.currentTarget.value) }} />
                <button onClick={signupUser} >Signup</button>
                <button onClick={switchPage}>login</button>
            </div>
        </div>
    )

}

export default Signup;
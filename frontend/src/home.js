import '.styles/styles.css';
import { useState} from 'react';
const Home = ({setIsLoggedIn}) =>{
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone , setPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [longtitude, setLongtitude] = useState();
    const [latitude, setLatitude] = useState();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    }

    const handleSubmit = async () =>{

            try {
                const data={
                    fullname,
                    phone,
                    relationship,
                    email,
                    coordinates:[longtitude,latitude]
                }
                const res = await fetch("http://127.0.0.1:3001/addAddress", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });
                if (res.status === 200) {
                    setEmail(``);
                    setFullname(``);
                    setPhone(``);
                    setRelationship(``);
                    setLongtitude(``);
                    setLatitude(``);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

    return(
        <div>
        <div>
            <h1>Home</h1>
        </div>
        <div className="Address-book">
            <button onClick={handleLogout}>Logout</button>
            <div className="Address-book-form">
                <h1>Add contact</h1>
                <input type="text" value = {fullname} placeholder="Full Name" onChange={e=>{setFullname(e.currentTarget.value)}}/>
                <input type="text" value = {phone} placeholder="Phone Number" onChange={e=>{setPhone(e.currentTarget.value)}}/>
                <input type="text" value = {relationship} placeholder="Relationship" onChange={e=>{setRelationship(e.currentTarget.value)}}/>
                <input type="text" value = {email} placeholder="Email" onChange={e=>{setEmail(e.currentTarget.value)}}/>
                <input type="text" value = {longtitude} placeholder="Location" onChange={e=>{setLongtitude(e.currentTarget.value)}}/>
                <input type="text" value = {latitude} placeholder="Location" onChange={e=>{setLatitude(e.currentTarget.value)}}/>
                <button onClick={handleSubmit}>Add</button>
            </div>
        </div>
        </div>
    )
}
export default Home;
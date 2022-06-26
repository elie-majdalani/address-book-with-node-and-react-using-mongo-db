import { useState, useEffect } from 'react';
import Map from './Map'
import 'leaflet/dist/leaflet.css';

const Home = ({ setIsLoggedIn }) => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [address, setAddress] = useState({});
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('fullname');
    //position of the marker to be sent to map
    const center = {
        lat: 33.8938,
        lng: 35.5018,
    }
    const [position, setPosition] = useState(center)

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    }
    const searchAddress = async () => {
        try {
            if (searchType === "fullname") {
                const res = await fetch("http://127.0.0.1:3001/searchbyname", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        search
                    })
                })
                const data = await res.json();
                if (data.length > 0) {
                    setAddress(data);
                }
            }
            if (searchType === "email") {
                const res = await fetch("http://127.0.0.1:3001/searchbyemail", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        search
                    })
                })
                const data = await res.json();
                if (data.length > 0) {
                    setAddress(data);
                }
            }
            if (searchType === "phone") {
                const res = await fetch("http://127.0.0.1:3001/searchbyphone", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        search
                    })
                })
                const data = await res.json();
                if (data.length > 0) {
                    setAddress(data);
                }
            }
            if (searchType === "relationship") {
                const res = await fetch("http://127.0.0.1:3001/searchbyrelationship", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        search
                    })
                })
                const data = await res.json();
                if (data.length > 0) {
                    setAddress(data);
                }
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    //getting data from database
    const fetchData = async () => {
        try {
            const res = await fetch("http://127.0.0.1:3001/getAddress", { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            const data = await res.json();
            if (data.length > 0) {
                setAddress(data);
            }
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchData();
    }
        , [])

    //   adding data to database
    const handleSubmit = async () => {

        try {
            const data = {
                fullname,
                phone,
                relationship,
                email,
                coordinates: [position.lat, position.lng]
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
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h1>Home</h1>
            </div>
            <div className='search-bar'>
                <select onChange={(e) => { setSearchType(e.target.value) }}>
                    <option value="fullname">Full Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone Number</option>
                    <option value="relationship">Relationship</option>
                </select>
                <input type="text" placeholder="Search Address" onBlur={(e) => { setSearch(e.currentTarget.value) }} />
                <button onClick={searchAddress} >Search</button>
            </div>
            <div className="Address-book">
                <button onClick={handleLogout}>Logout</button>
                <div className="Address-book-form">
                    <h1>Add contact</h1>
                    <input type="text" value={fullname} placeholder="Full Name" onChange={e => { setFullname(e.currentTarget.value) }} />
                    <input type="text" value={phone} placeholder="Phone Number" onChange={e => { setPhone(e.currentTarget.value) }} />
                    <input type="text" value={relationship} placeholder="Relationship" onChange={e => { setRelationship(e.currentTarget.value) }} />
                    <input type="text" value={email} placeholder="Email" onChange={e => { setEmail(e.currentTarget.value) }} />
                    <div className="google-maps">
                        <div className="google-maps-map">
                            <Map position={position} setPosition={setPosition} />
                        </div>
                    </div>
                    <button onClick={handleSubmit}>Add</button>
                </div>
                <div className='Contatcs'>
                    {address.length > 0 && address.map((data, index) => {
                        return (
                            <div key={index}>
                                <h1>{data.fullname}</h1>
                                <h1>{data.phone}</h1>
                                <h1>{data.relationship}</h1>
                                <h1>{data.email}</h1>
                                {data.location.coordinates[0] != null && <Map position={{ lat: data.location.coordinates[0], lng: data.location.coordinates[1] }} setPosition={setPosition} />}
                            </div>)
                    })}
                </div>
            </div>
        </div>
    )
}
export default Home;
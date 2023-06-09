import React from 'react'
import axios from 'axios'
import CryptoJS from 'crypto-js'

import { Helmet } from 'react-helmet'
import Navbar from './partials/navbar'
import Footer from './partials/footer'

import '../styles/responsive.css'
import '../styles/home.css'
import '../styles/index.css'
import '../styles/moderation.css'
import '../styles/profile.css'
import '../styles/requestsAndOffers.css'

function Moderation(){
    const [pendingRequests, setPendingRequests] = React.useState([])
    const [users, setUsers] = React.useState([])
    var pendingArray = []

    function CheckIfBlocked(user){
        if(user.blocked){
            return null
        }
        else if (!user.blocked){
            return <button className="button-primary button button-size" onClick={() => blockUser(user.userId)}>Blokiraj</button>
        }
    }

    
    function CheckIfAdmin(user){
        if(user.role.roleId == 4){
            return null;
        }
        else if (user.role.roleId != 4){
            return <button className="button-primary button button-size" onClick={() => addAdmin(user.userId)}>Dodaj admina</button>
        }
    }


    function CheckRequestType(request){
        if(request.requestGuardianId){
            return "Zahtjev"
        }
        else if (request.requestDogId){
            return "Oglas"
        }
    }


    function decrypt(password) {
        return CryptoJS.enc.Base64.parse(password).toString(CryptoJS.enc.Utf8);
    }


    function approveRequest(request){
        var basicAuth = localStorage.getItem("id") == undefined ? '' : 'Basic ' + window.btoa(localStorage.getItem("username") + ":" + decrypt(localStorage.getItem("encryptedPassword")));
        let userId = request.requestGuardianId == undefined ? request.requestDogId : request.requestGuardianId
        let path = CheckRequestType(request) == "Zahtjev" ? '/api/users/moderation/reqgua/' + userId + '/1' : '/api/users/moderation/reqdog/' + userId + '/1'
        axios.post(path, {
            "id": userId,
            "val": 1
        }, { headers : {'Authorization': basicAuth}}).then(async response => {
            console.log(response)
            window.location.reload();
        }).catch(err => {
            console.log(err);
            alert(err.response.data.message)
            if(localStorage.getItem("id") == undefined) window.location.href = "/users/login";
        })
    }
    
    
    function denyRequest(request){
        var basicAuth = localStorage.getItem("id") == undefined ? '' : 'Basic ' + window.btoa(localStorage.getItem("username") + ":" + decrypt(localStorage.getItem("encryptedPassword")));
        let userId = request.requestGuardianId == undefined ? request.requestDogId : request.requestGuardianId
        let path = CheckRequestType(request) == "Zahtjev" ? '/api/users/moderation/reqgua/' + userId + '/0' : '/api/users/moderation/reqdog/' + userId + '/0'
        axios.post(path, {
            "id": userId,
            "val": 0
        }, { headers : {'Authorization': basicAuth}}).then(async response => {
            console.log(response)
            window.location.reload();
        }).catch(err => {
            console.log(err);
            alert(err.response.data.message)
            if(localStorage.getItem("id") == undefined) window.location.href = "/users/login";
        })
    }   


    function blockUser(id){
        var basicAuth = localStorage.getItem("id") == undefined ? '' : 'Basic ' + window.btoa(localStorage.getItem("username") + ":" + decrypt(localStorage.getItem("encryptedPassword")));
        axios.post('/api/users/moderation/block/' + id, {
            "id": id
        }, { headers : {'Authorization': basicAuth}}).then((response) => {
            window.alert("Uspješno blokirano!")
            console.log(response);
        }).catch(err => {
            console.log(err);
            if(localStorage.getItem("id") == undefined) window.location.href = "/users/login";
        });
    }


    function addAdmin(id){
        var basicAuth = localStorage.getItem("id") == undefined ? '' : 'Basic ' + window.btoa(localStorage.getItem("username") + ":" + decrypt(localStorage.getItem("encryptedPassword")));
        axios.post('/api/users/moderation/give-admin/' + id, {
            "id": id
        }, { headers : {'Authorization': basicAuth}}).then((response) => {
            window.alert("Uspješno davanje admina!")
            console.log(response);
        }).catch(err => {
            console.log(err);
            if(localStorage.getItem("id") == undefined) window.location.href = "/users/login";
        });
    }


    React.useEffect(() => {
        var basicAuth = localStorage.getItem("id") == undefined ? '' : 'Basic ' + window.btoa(localStorage.getItem("username") + ":" + decrypt(localStorage.getItem("encryptedPassword")));
        let id = localStorage.getItem('id');
        axios.get('/api/users/moderation/' + id + '/r', { headers : {'Authorization': basicAuth}}).then(response => {
            for(const[key, value] of Object.entries(response.data)){
                pendingArray.push(value)
            }
            setPendingRequests(pendingArray);
        }).catch(err => {
            alert(err.response.data.message);
            if(localStorage.getItem("id") == undefined) window.location.href = "/users/login";
        })
    }, []);

    React.useEffect(() => {
        var basicAuth = localStorage.getItem("id") == undefined ? '' : 'Basic ' + window.btoa(localStorage.getItem("username") + ":" + decrypt(localStorage.getItem("encryptedPassword")));
        let id = localStorage.getItem('id');
        axios.get('/api/users/moderation/' + id + '/u', { headers : {'Authorization': basicAuth}}).then(response => {
            setUsers(response.data);
        }).catch(err => {
            alert(err.response.data.message);
            if(localStorage.getItem("id") == undefined) window.location.href = "/users/login";
        })
    }, []);



    return (
        <div className="page-container">
            <Helmet>
                <title>CuvariPasa | Naslovnica</title>
            </Helmet>

            <Navbar/>

            {(pendingRequests.length > 0 &&
                <div className='moderation-container'>
                    
                    <table className='user-table'>
                        <caption>
                            <h2>Moderacija oglasa i zahtjeva</h2>
                            <div className='empty-space-small'/>
                        </caption>
                        
                        <tbody>
                            <tr>
                                <th>Tip</th>
                                <th>Korisnik</th>
                                <th>Lokacija</th>
                                <th>Broj pasa</th>
                                <th className='text-citrus'>asdsa</th>
                                <th className='text-citrus'>sadsa</th>
                            </tr>

                            {pendingRequests.map(requestType =>
                                requestType.map(requests => 
                                    requests.map(request =>
                                        <tr key = {request.appUser.userId}>
                                            <td>{CheckRequestType(request)}</td>
                                            <td>{request.appUser.username}</td>
                                            <td>{request.locationName}</td>
                                            <td>{request.numberOfDogs}</td>
                                            <td><button className="button-primary button button-size" onClick={() => approveRequest(request)}>Odobri</button></td>
                                            <td><button className="button-primary button button-size" onClick={() => denyRequest(request)}>Odbij</button></td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className='empty-space-small'/>

            {(users.length &&
                <div className='moderation-container'>
                    <table className='user-table'>
                        <caption>
                            <h2>Moderacija korisnika</h2>
                            <div className='empty-space-small'/>
                        </caption>
                        
                        <tbody>
                            <tr>
                                <th>Username</th>
                                <th>Ime i prezime</th>
                                <th>Email</th>
                                <th className='text-citrus'>asdsasdsda</th>
                                <th className='text-citrus'>sadasdsdsa</th>
                            </tr>
                            {users.map(user =>
                                <tr key={user.userId}>
                                    <td>{user.username}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td className='block-button'>{CheckIfBlocked(user)}</td>
                                    <td className='admin-button'>{CheckIfAdmin(user)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Moderation;
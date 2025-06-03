import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUser } from './App';
import { useContext, useEffect } from 'react';
import { logOutFunc } from '../js/logout';
import Cookies from 'js-cookie';

function Navigation({ setIsShowInfo }) {
    const { currentUser, setCurrentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    function logOut() {
        logOutFunc(navigate);
        setCurrentUser(null);
    }

    return (
        <>
            {currentUser ? <div>
                <nav className='header'>
                    <div className="left">
                        <ul><Link to={`/users/${currentUser.id}/home`} >Home</Link></ul>
                        <ul><a onClick={() => setIsShowInfo(1)}>Info</a></ul>
                    </div>
                    <h3 className='fullName'> Hello {currentUser.fullName}</h3>
                    <div className="right">
                        <ul onClick={logOut}><a>LogOut</a></ul>
                    </div>
                </nav>
            </div>
                :
                < nav className='header' >
                    <div className="left">
                        <ul><Link to="/home" >Home</Link></ul>
                        <ul><Link to="/login" >Login</Link></ul>
                        <ul><Link to="/signup" >Register</Link></ul>
                    </div>
                </nav >
            }
        </>
    )
}
export default Navigation;
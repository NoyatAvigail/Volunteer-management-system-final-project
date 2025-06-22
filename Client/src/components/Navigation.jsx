import React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUser } from './App';
import { useCodes } from "./Models";
import { logOutFunc } from '../js/logout';
import Cookies from 'js-cookie';
import ErrorPage from './ErrorPage';
import logo from '../style/img/logo.png';

function Navigation() {
    const { currentUser, setCurrentUser } = useContext(CurrentUser);
    const navigate = useNavigate();
    const { codes, loading } = useCodes();
    const userTypeObject = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;

    function logOut() {
        logOutFunc(navigate);
        setCurrentUser(null);
    }

    return (
        <>
            {currentUser ? (
                <div>
                    {userTypeObject == 'Volunteer' ? (
                        < div >
                            <nav className='header'>
                                <div className="left">
                                    <h3 className='userName'> {currentUser.fullName}</h3>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/home`}>Home page</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/shifts`}>My shifts</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/requests`}>Open requests</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/profile`}>Profile management</Link></ul >
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/certificate`}>Volunteer certificate</Link></ul>
                                    <div className="right">
                                        <ul onClick={logOut}><a>Logout</a></ul>
                                    </div>
                                    <img src={logo} alt="Logo" className="logo" />
                                </div >
                            </nav >
                        </div >
                    ) : userTypeObject == 'ContactPerson' ? (
                        <div>
                            <nav className='header'>
                                <div className="left">
                                    <h3 className='userName'>{currentUser.fullName}</h3>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/home`}>Home page</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/requests`}>My requests</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/profile`}>Profile management</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/thanks`}>Thanks</Link></ul>
                                    <details className='patientLink'>
                                        <summary>Patients</summary>
                                        <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/patient/add-patient`}>Add patient</Link></ul>
                                        <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/patient/add-hospitalization`}>Add hospitalization</Link></ul>
                                        {/* <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/patient/info`}>Patient info</Link></ul> */}
                                        <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/patient/profile`}>Manage patient profile</Link></ul>
                                    </details>
                                    <div className="right">
                                        <ul onClick={logOut}><a>Logout</a></ul>
                                    </div>
                                    <img src={logo} alt="Logo" className="logo" />
                                </div>
                            </nav>
                        </div>
                    ) : (
                        <ErrorPage />
                    )
                    }
                </div >
            ) : (
                <nav className='header'>
                    <div className="left">
                        <ul><Link to="/home">Home page</Link></ul>
                        <ul><Link to="/login">Login</Link></ul>
                        <ul><Link to="/signup">Sign Up</Link></ul>
                    </div>
                    <img src={logo} alt="Logo" className="logo" />
                </nav>
            )
            }
        </>
    );
}

export default Navigation;
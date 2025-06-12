import React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUser } from './App';
import { CodesContext } from './Models';
import { logOutFunc } from '../js/logout';
import Cookies from 'js-cookie';
import ErrorPage from './ErrorPage';

function Navigation({ setIsShowInfo }) {
    const { currentUser, setCurrentUser } = useContext(CurrentUser);
    const navigate = useNavigate();
    const { codes, loading } = useContext(CodesContext);
    console.log(currentUser?.type);
    console.log("codes?.UserTypes:", codes?.UserTypes);
    const userTypeObject = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    console.log("userTypeObject:", userTypeObject);

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
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/home`}>דף הבית</Link></ul>
                                    <ul><a onClick={() => setIsShowInfo(1)}>מידע</a></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/shifts`}>המשמרות שלי</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/fixedShifts`}>משמרות קבועות</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/requests`}>בקשות פתוחות</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/certificate`}>תעודת מתנדב</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/profile`}>ניהול פרופיל</Link></ul >
                                    <div className="right">
                                        <ul onClick={logOut}><a>התנתקות</a></ul>
                                    </div>
                                </div >
                            </nav >
                        </div >
                    ) : userTypeObject == 'ContactPerson' ? (
                        <div>
                            <nav className='header'>
                                <div className="left">
                                    <h3 className='userName'>{currentUser.fullName}</h3>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/home`}>דף הבית</Link></ul>
                                    <ul><a onClick={() => setIsShowInfo(1)}>פרטים אישיים</a></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/patient-info`}>מידע על המטופל</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/requests`}>הפניות שלי</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/new-request`}>הוספת פנייה</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/add-patient`}>הוספת מטופל</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/thanks`}>אני רוצה לומר תודה</Link></ul>
                                    <ul><Link to={`/${userTypeObject}/${currentUser.autoId}/profile`}>ניהול פרופיל</Link></ul>
                                    <div className="right">
                                        <ul onClick={logOut}><a>התנתקות</a></ul>
                                    </div>
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
                        <ul><Link to="/home">דף הבית</Link></ul>
                        <ul><Link to="/login">התחברות</Link></ul>
                        <ul><Link to="/signup">הרשמה</Link></ul>
                    </div>
                </nav>
            )
            }
        </>
    );
}

export default Navigation;
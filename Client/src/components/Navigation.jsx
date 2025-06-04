import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUser } from './App';
import { useContext } from 'react';
import { logOutFunc } from '../js/logout';
import Cookies from 'js-cookie';
import ErrorPage from './ErrorPage';

function Navigation({ setIsShowInfo, type }) {
    const { currentUser, setCurrentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    function logOut() {
        logOutFunc(navigate);
        setCurrentUser(null);
    }

    return (
        <>
            {currentUser ? (
                <div>
                    {currentUser.user.type == 'volunteer' ? (
                        <div>
                            <nav className='header'>
                                <div className="left">
                                    <h3 className='userName'>שלום {currentUser.user.fullName}</h3>
                                    <ul><Link to="/home">דף הבית</Link></ul>
                                    <ul><a onClick={() => setIsShowInfo(1)}>מידע</a></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/tasks`}>המשימות שלי</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/shifts`}>משמרות קבועות</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/requests`}>בקשות פתוחות</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/certificate`}>תעודת מתנדב</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/profile`}>ניהול פרופיל</Link></ul>
                                    <div className="right">
                                        <ul onClick={logOut}><a>התנתקות</a></ul>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    ) : currentUser.user.type == 'contact' ? (
                        <div>
                            <nav className='header'>
                                <div className="left">
                                    <h3 className='userName'>שלום {currentUser.fullName}</h3>
                                    <ul><Link to="/home">דף הבית</Link></ul>
                                    <ul><a onClick={() => setIsShowInfo(1)}>מידע</a></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/patient-info`}>מידע על המטופל</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/referrals`}>הפניות שלי</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/new-request`}>הוספת פנייה</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/add-patient`}>הוספת מטופל</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/thanks`}>םני רוצה לומר תודה</Link></ul>
                                    <ul><Link to={`/${currentUser.user.type}/${currentUser.user.autoId}/profile`}>ניהול פרופיל</Link></ul>
                                    <div className="right">
                                        <ul onClick={logOut}><a>התנתקות</a></ul>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    ) : (
                        <ErrorPage />
                    )}
                </div>
            ) : (
                <nav className='header'>
                    <div className="left">
                        <ul><Link to="/home">דף הבית</Link></ul>
                        <ul><Link to="/login">התחברות</Link></ul>
                        <ul><Link to="/signup">הרשמה</Link></ul>
                    </div>
                </nav>
            )}
        </>
    );
}

export default Navigation;
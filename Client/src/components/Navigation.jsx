import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUser } from './App';
// import { CodesContext } from './CodesProvider';
import { useCodes } from './Models';
import { useContext } from 'react';
import { logOutFunc } from '../js/logout';
import Cookies from 'js-cookie';
import ErrorPage from './ErrorPage';

function Navigation({ setIsShowInfo }) {
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
                    {CodesContext.UserTypes == 'volunteer' ? (
                        <div>
                            <nav className='header'>
                                <div className="left">
                                    <h3 className='userName'> {currentUser.fullName}</h3>
                                    <ul><Link to={`/${CodesContext.UserTypes}/${currentUser.autoId}/home`}>דף הבית</Link></ul>
                                    <ul><a onClick={() => setIsShowInfo(1)}>מידע</a></ul>
                                    <ul><Link to={`/${CodesContext.UserTypes}/${currentUser.autoId}/shifts`}>המשמרות שלי</Link></ul>
                                    <ul><Link to={`/${CodesContext.UserTypes}/${currentUser.autoId}/fixedShifts`}>משמרות קבועות</Link></ul>
                                    <ul><Link to={`/${CodesContext.UserTypes}/${currentUser.autoId}/requests`}>בקשות פתוחות</Link></ul>
                                    <ul><Link to={`/${CodesContext.UserTypes}/${currentUser.autoId}/certificate`}>תעודת מתנדב</Link></ul>
                                    <ul><Link to={`/${CodesContext.UserTypes}/${currentUser.autoId}/profile`}>ניהול פרופיל</Link></ul >
                                    <div className="right">
                                        <ul onClick={logOut}><a>התנתקות</a></ul>
                                    </div>
                                </div >
                            </nav >
                        </div >
                    ) : currentUser.type == 'Contact' ? (
                        <div>
                            <nav className='header'>
                                <div className="left">
                                    <h3 className='userName'>{currentUser.fullName}</h3>
                                    <ul><Link to={`/${currentUser.type}/${currentUser.autoId}/home`}>דף הבית</Link></ul>
                                    <ul><a onClick={() => setIsShowInfo(1)}>פרטים אישיים</a></ul>
                                    <ul><Link to={`/${currentUser.type}/${currentUser.autoId}/patient-info`}>מידע על המטופל</Link></ul>
                                    <ul><Link to={`/${currentUser.type}/${currentUser.autoId}/requests`}>הפניות שלי</Link></ul>
                                    <ul><Link to={`/${currentUser.type}/${currentUser.autoId}/new-request`}>הוספת פנייה</Link></ul>
                                    <ul><Link to={`/${currentUser.type}/${currentUser.autoId}/add-patient`}>הוספת מטופל</Link></ul>
                                    <ul><Link to={`/${currentUser.type}/${currentUser.autoId}/thanks`}>אני רוצה לומר תודה</Link></ul>
                                    <ul><Link to={`/${currentUser.type}/${currentUser.autoId}/profile`}>ניהול פרופיל</Link></ul>
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
            )}
        </>
    );
}

export default Navigation;
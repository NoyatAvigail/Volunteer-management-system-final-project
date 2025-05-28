// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { useState, useContext } from 'react';
// import { CurrentUser } from './App';
// import Cookies from "js-cookie";
// import { validateFirstRegisterStep, validateSecondRegisterStep } from '../../utils/userValidator';
// import { signup } from '../../services/usersServices';
// import '../style/Register.css';

// function Register() {
//     const navigate = useNavigate();
//     const { register, handleSubmit: handleFirstSubmit, reset: resetFirstForm } = useForm();
//     const { register: registerSecond, handleSubmit: handleSecondSubmit, reset: resetSecondForm } = useForm();
//     const [registerIsCompleted, setRegisterIsCompleted] = useState(0);
//     const [responsText, setResponstText] = useState("Fill the form and click the sign up button");
//     const { setCurrentUser } = useContext(CurrentUser);
//     const [userData, setUserData] = useState({});

//     const onFirstSubmit = async (data) => {
//         const error = validateFirstRegisterStep(data);
//         if (error) {
//             setResponstText(error);
//             return;
//         }
//         setUserData({ username: data.username, password: data.password });
//         setRegisterIsCompleted(1);
//         resetFirstForm();
//     };

//     const onSecondSubmit = async (data) => {
//         const error = validateSecondRegisterStep(data);
//         if (error) {
//             setResponstText(error);
//             return;
//         }
//         const fullUser = {
//             ...userData,
//             name: data.name,
//             email: data.email,
//             address: {
//                 street: data.street,
//                 suite: data.suite,
//                 city: data.city,
//                 zipcode: data.zipcode,
//                 geo: {
//                     lat: data.lat,
//                     lng: data.lng,
//                 },
//             },
//             phone: data.phone,
//             website: data.website,
//             company: {
//                 name: data.companyName,
//                 catchPhrase: data.catchPhrase,
//                 bs: data.bs,
//             },
//         };

//         await signup(
//             fullUser,
//             (createdUser) => {
//                 navigate(`/users/${createdUser.id}/home`);
//                 Cookies.set("token", createdUser.token);
//                 setCurrentUser(createdUser.user);
//                 localStorage.setItem("currentUser", JSON.stringify(createdUser.user));
//             },
//             () => {
//                 setResponstText("Registration failed. Please try again.");
//             }
//         );
//         resetSecondForm();
//     };

//     return (
//         <div className="back-ground-img">
//             {registerIsCompleted === 0 ? (
//                 <div>
//                     <h2>Sign Up</h2>
//                     <div className="entryContainer">
//                         <form onSubmit={handleFirstSubmit(onFirstSubmit)} className="entryForm">
//                             <input type="text" placeholder="username" {...register("username")} required />
//                             <input type="password" placeholder="password" {...register("password")} required />
//                             <input type="password" placeholder="verifyPassword" {...register("verifyPassword")} required />
//                             <button type="submit">sign up</button>
//                             <h4>{responsText}</h4>
//                         </form>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="form-container">
//                     <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
//                         <h2 className="form-title">More Details</h2>
//                         <input {...registerSecond("name")} placeholder="Name" required />
//                         <input {...registerSecond("email")} placeholder="Email" required />
//                         <fieldset>
//                             <legend>Address</legend>
//                             <input {...registerSecond("street")} placeholder="Street" required />
//                             <input {...registerSecond("suite")} placeholder="Suite" required />
//                             <input {...registerSecond("city")} placeholder="City" required />
//                             <input {...registerSecond("zipcode")} placeholder="Zipcode" required />
//                             <input {...registerSecond("lat")} placeholder="Latitude" required />
//                             <input {...registerSecond("lng")} placeholder="Longitude" required />
//                         </fieldset>
//                         <input {...registerSecond("phone")} placeholder="Phone" required />
//                         <fieldset>
//                             <legend>Company</legend>
//                             <input {...registerSecond("companyName")} placeholder="Company Name" required />
//                             <input {...registerSecond("catchPhrase")} placeholder="CatchPhrase" required />
//                             <input {...registerSecond("bs")} placeholder="Business Strategy" required />
//                         </fieldset>
//                         <input {...registerSecond("website")} placeholder="Website" required />
//                         <button type="submit" className="form-button">Submit</button>
//                         <h4>{responsText}</h4>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Register;
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";

// export default function Register() {
//     const { register, handleSubmit,watch, formState: { errors } } = useForm();
//     const { register: registerSecond, handleSubmit: handleSubmitSecond, formState: { errors: errorsSecond } } = useForm();
//     const [registerIsCompleted, setRegisterIsCompleted] = useState(0);
//     const [userType, setUserType] = useState(null);
//     const [userData, setUserData] = useState({});
//     const onSubmitFirst = (data) => { setUserData(data); setRegisterIsCompleted(1); };
//     const onSubmitSecond = (data) => {
//         const fullUserData = {
//             ...userData,
//             role: userType,
//             details: data,
//         };
//         console.log("User registration complete:", fullUserData);
//     };

//     return (
//         <div>
//             {registerIsCompleted === 0 && (
//                 <form onSubmit={handleSubmit(onSubmitFirst)}>
//                     <h2>שלב 1: הזנת פרטי משתמש בסיסיים</h2>
//                     <input
//                         placeholder="username"
//                         {...register("username", { required: true })}
//                     />
//                     {errors.username && <p>יש להזין שם משתמש</p>}

//                     <input
//                         type="email"
//                         placeholder="email"
//                         {...register("email", { required: true })}
//                     />
//                     {errors.email && <p>יש להזין מייל תקין</p>}

//                     <input
//                         type="password"
//                         placeholder="password"
//                         {...register("password", { required: true, minLength: 6 })}
//                     />
//                     {errors.password && <p>יש להזין סיסמה באורך מינימום 6 תווים</p>}

//                     <input
//                         type="password"
//                         placeholder="אימות סיסמה"
//                         {...register("passwordConfirm", {
//                             required: true,
//                             validate: (value) => value == watch("password"),
//                         })}
//                     />
//                     {errors.passwordConfirm && <p>הסיסמאות אינן תואמות</p>}

//                     <div>
//                         <button type="button" onClick={() => setUserType("volunteer")}>
//                             אני מתנדב
//                         </button>
//                         <button type="button" onClick={() => setUserType("contact")}>
//                             אני איש קשר
//                         </button>
//                     </div>
//                     {!userType && <p>יש לבחור סוג משתמש</p>}

//                     <button type="submit" disabled={!userType}>
//                         המשך
//                     </button>
//                 </form>
//             )}

//             {registerIsCompleted === 1 && userType === "volunteer" && (
//                 <form onSubmit={handleSubmitSecond(onSubmitSecond)}>
//                     <h2>טופס מתנדב</h2>
//                     <input
//                         placeholder="ת.ז."
//                         {...registerSecond("tz", { required: true })}
//                     />
//                     {errorsSecond.tz && <p>יש להזין ת.ז.</p>}

//                     <input value={userData.username} readOnly />
//                     <input
//                         placeholder="תאריך לידה"
//                         {...registerSecond("birthDate", { required: true })}
//                     />
//                     {errorsSecond.birthDate && <p>יש להזין תאריך לידה</p>}

//                     <select {...registerSecond("gender", { required: true })}>
//                         <option value="">בחר מין</option>
//                         <option value="זכר">זכר</option>
//                         <option value="נקבה">נקבה</option>
//                     </select>
//                     {errorsSecond.gender && <p>יש לבחור מין</p>}

//                     <input
//                         placeholder="מגזר"
//                         {...registerSecond("sector", { required: true })}
//                     />
//                     {errorsSecond.sector && <p>יש להזין מגזר</p>}

//                     <input
//                         placeholder="טלפון"
//                         {...registerSecond("phone", { required: true })}
//                     />
//                     {errorsSecond.phone && <p>יש להזין טלפון</p>}

//                     <input
//                         placeholder="כתובת"
//                         {...registerSecond("address", { required: true })}
//                     />
//                     {errorsSecond.address && <p>יש להזין כתובת</p>}

//                     <input type="file" {...registerSecond("image")} />

//                     <label>תחומי התנדבות:</label>
//                     <div>
//                         <input
//                             type="checkbox"
//                             {...registerSecond("helpType")}
//                             value="שמירה"
//                             id="help-shmira"
//                         />
//                         <label htmlFor="help-shmira">שמירה</label>
//                         <input
//                             type="checkbox"
//                             {...registerSecond("helpType")}
//                             value="ביקור"
//                             id="help-bikur"
//                         />
//                         <label htmlFor="help-bikur">ביקור</label>
//                     </div>

//                     {/* אפשר להוסיף כאן שדות נוספים לפי הצורך */}

//                     <button type="submit">הרשם</button>
//                 </form>
//             )}

//             {registerIsCompleted === 1 && userType === "contact" && (
//                 <form onSubmit={handleSubmitSecond(onSubmitSecond)}>
//                     <h2>טופס איש קשר</h2>
//                     <input
//                         placeholder="ת.ז."
//                         {...registerSecond("tz", { required: true })}
//                     />
//                     {errorsSecond.tz && <p>יש להזין ת.ז.</p>}

//                     <input value={userData.username} readOnly />
//                     <input
//                         placeholder="טלפון"
//                         {...registerSecond("phone", { required: true })}
//                     />
//                     {errorsSecond.phone && <p>יש להזין טלפון</p>}

//                     <input
//                         placeholder="כתובת"
//                         {...registerSecond("address", { required: true })}
//                     />
//                     {errorsSecond.address && <p>יש להזין כתובת</p>}

//                     <input
//                         placeholder="סוג קרבה"
//                         {...registerSecond("relation", { required: true })}
//                     />
//                     {errorsSecond.relation && <p>יש להזין סוג קרבה</p>}

//                     <h3>פרטי מטופל</h3>
//                     <input
//                         placeholder="ת.ז. של מטופל"
//                         {...registerSecond("patientTz", { required: true })}
//                     />
//                     {errorsSecond.patientTz && <p>יש להזין ת.ז. מטופל</p>}

//                     <input
//                         placeholder="שם מטופל"
//                         {...registerSecond("patientName", { required: true })}
//                     />
//                     {errorsSecond.patientName && <p>יש להזין שם מטופל</p>}

//                     <input
//                         placeholder="תאריך לידה"
//                         {...registerSecond("patientBirth", { required: true })}
//                     />
//                     {errorsSecond.patientBirth && <p>יש להזין תאריך לידה</p>}

//                     <select {...registerSecond("patientGender", { required: true })}>
//                         <option value="">בחר מין</option>
//                         <option value="זכר">זכר</option>
//                         <option value="נקבה">נקבה</option>
//                     </select>
//                     {errorsSecond.patientGender && <p>יש לבחור מין</p>}

//                     <input
//                         placeholder="מגזר"
//                         {...registerSecond("patientSector", { required: true })}
//                     />
//                     {errorsSecond.patientSector && <p>יש להזין מגזר</p>}

//                     <input
//                         placeholder="כתובת"
//                         {...registerSecond("patientAddress", { required: true })}
//                     />
//                     {errorsSecond.patientAddress && <p>יש להזין כתובת</p>}

//                     <label>
//                         <input type="checkbox" {...registerSecond("notifications")} />
//                         מעוניין לקבל התראות
//                     </label>

//                     <input
//                         placeholder="בית חולים"
//                         {...registerSecond("hospital", { required: true })}
//                     />
//                     {errorsSecond.hospital && <p>יש להזין בית חולים</p>}

//                     <input
//                         placeholder="מחלקה"
//                         {...registerSecond("department", { required: true })}
//                     />
//                     {errorsSecond.department && <p>יש להזין מחלקה</p>}

//                     <input
//                         placeholder="מס’ חדר"
//                         {...registerSecond("roomNumber", { required: true })}
//                     />
//                     {errorsSecond.roomNumber && <p>יש להזין מס’ חדר</p>}

//                     <button type="submit">הרשם</button>
//                 </form>
//             )}
//         </div>
//     );
// }
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { register: registerSecond, handleSubmit: handleSubmitSecond, formState: { errors: errorsSecond } } = useForm();
    const [registerIsCompleted, setRegisterIsCompleted] = useState(0);
    const [userType, setUserType] = useState(null);
    const [userData, setUserData] = useState({});

    const onSubmitFirst = (data) => {
        const { passwordConfirm, ...rest } = data;
        const encryptedPassword = btoa(rest.password);
        const encryptedUser = { ...rest, password: encryptedPassword };
        setUserData(encryptedUser);
        setRegisterIsCompleted(1);
    };

    const onSubmitSecond = (data) => {
        const fullUserData = {
            ...userData,
            role: userType,
            details: data,
        };
        console.log("User registration complete:", fullUserData);
    };

    const sectors = ["חרדי", "דתי", "חילוני", "מסורתי"];
    const hospitals = ["שיבא", "איכילוב", "הדסה עין כרם", "שערי צדק", "בלינסון", "ברזילי", "סורוקה"];
    const departments = ["פנימית", "אורתופדיה", "ילדים", "ניתוחים", "שיקום"];
    const relations = ["אבא", "אמא", "אח", "אחות", "סבא", "סבתא", "בן זוג", "בת זוג"];

    return (
        <div>
            {registerIsCompleted === 0 && (
                <form onSubmit={handleSubmit(onSubmitFirst)}>
                    <h2>שלב 1: הזנת פרטי משתמש בסיסיים</h2>

                    <input placeholder="username" {...register("username", { required: true })} />
                    {errors.username && <p>יש להזין שם משתמש</p>}

                    <input type="email" placeholder="email" {...register("email", { required: true })} />
                    {errors.email && <p>יש להזין מייל תקין</p>}

                    <input type="password" placeholder="password" {...register("password", { required: true, minLength: 6 })} />
                    {errors.password && <p>יש להזין סיסמה באורך מינימום 6 תווים</p>}

                    <input type="password" placeholder="אימות סיסמה"
                        {...register("passwordConfirm", {
                            required: true,
                            validate: (value) => value == watch("password"),
                        })}
                    />
                    {errors.passwordConfirm && <p>הסיסמאות אינן תואמות</p>}

                    <div>
                        <button type="button" onClick={() => setUserType("volunteer")}>אני מתנדב</button>
                        <button type="button" onClick={() => setUserType("contact")}>אני איש קשר</button>
                    </div>
                    {!userType && <p>יש לבחור סוג משתמש</p>}
                    <button type="submit" disabled={!userType}>המשך</button>
                </form>
            )}

            {registerIsCompleted === 1 && userType === "volunteer" && (
                <form onSubmit={handleSubmitSecond(onSubmitSecond)}>
                    <h2>טופס מתנדב</h2>

                    <input placeholder="ת.ז." {...registerSecond("tz", { required: true })} />
                    {errorsSecond.tz && <p>יש להזין ת.ז.</p>}

                    <input value={userData.username} readOnly />

                    <input placeholder="תאריך לידה" {...registerSecond("birthDate", { required: true })} />
                    {errorsSecond.birthDate && <p>יש להזין תאריך לידה</p>}

                    <select {...registerSecond("gender", { required: true })}>
                        <option value="">בחר מין</option>
                        <option value="זכר">זכר</option>
                        <option value="נקבה">נקבה</option>
                    </select>
                    {errorsSecond.gender && <p>יש לבחור מין</p>}

                    <select {...registerSecond("sector", { required: true })}>
                        <option value="">בחר מגזר</option>
                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errorsSecond.sector && <p>יש לבחור מגזר</p>}

                    <input placeholder="טלפון" {...registerSecond("phone", { required: true })} />
                    {errorsSecond.phone && <p>יש להזין טלפון</p>}

                    <input placeholder="כתובת" {...registerSecond("address", { required: true })} />
                    {errorsSecond.address && <p>יש להזין כתובת</p>}

                    <input type="file" {...registerSecond("image")} />

                    <label>תחומי התנדבות:</label>
                    <div>
                        <input type="checkbox" {...registerSecond("helpType")} value="שמירה" id="help-shmira" />
                        <label htmlFor="help-shmira">שמירה</label>
                        <input type="checkbox" {...registerSecond("helpType")} value="ביקור" id="help-bikur" />
                        <label htmlFor="help-bikur">ביקור</label>
                    </div>

                    <button type="submit">הרשם</button>
                </form>
            )}

            {registerIsCompleted === 1 && userType === "contact" && (
                <form onSubmit={handleSubmitSecond(onSubmitSecond)}>
                    <h2>טופס איש קשר</h2>

                    <input placeholder="ת.ז." {...registerSecond("tz", { required: true })} />
                    {errorsSecond.tz && <p>יש להזין ת.ז.</p>}

                    <input value={userData.username} readOnly />

                    <input placeholder="טלפון" {...registerSecond("phone", { required: true })} />
                    {errorsSecond.phone && <p>יש להזין טלפון</p>}

                    <input placeholder="כתובת" {...registerSecond("address", { required: true })} />
                    {errorsSecond.address && <p>יש להזין כתובת</p>}

                    <select {...registerSecond("relation", { required: true })}>
                        <option value="">בחר סוג קרבה</option>
                        {relations.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errorsSecond.relation && <p>יש לבחור סוג קרבה</p>}

                    <h3>פרטי מטופל</h3>
                    <input placeholder="ת.ז. של מטופל" {...registerSecond("patientTz", { required: true })} />
                    {errorsSecond.patientTz && <p>יש להזין ת.ז. מטופל</p>}

                    <input placeholder="שם מטופל" {...registerSecond("patientName", { required: true })} />
                    {errorsSecond.patientName && <p>יש להזין שם מטופל</p>}

                    <input placeholder="תאריך לידה" {...registerSecond("patientBirth", { required: true })} />
                    {errorsSecond.patientBirth && <p>יש להזין תאריך לידה</p>}

                    <select {...registerSecond("patientGender", { required: true })}>
                        <option value="">בחר מין</option>
                        <option value="זכר">זכר</option>
                        <option value="נקבה">נקבה</option>
                    </select>
                    {errorsSecond.patientGender && <p>יש לבחור מין</p>}

                    <select {...registerSecond("patientSector", { required: true })}>
                        <option value="">בחר מגזר</option>
                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errorsSecond.patientSector && <p>יש לבחור מגזר</p>}

                    <input placeholder="כתובת" {...registerSecond("patientAddress", { required: true })} />
                    {errorsSecond.patientAddress && <p>יש להזין כתובת</p>}

                    <label>
                        <input type="checkbox" {...registerSecond("notifications")} />
                        מעוניין לקבל התראות
                    </label>

                    <select {...registerSecond("hospital", { required: true })}>
                        <option value="">בחר בית חולים</option>
                        {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    {errorsSecond.hospital && <p>יש לבחור בית חולים</p>}

                    <select {...registerSecond("department", { required: true })}>
                        <option value="">בחר מחלקה</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errorsSecond.department && <p>יש לבחור מחלקה</p>}

                    <input placeholder="מס’ חדר" {...registerSecond("roomNumber", { required: true })} />
                    {errorsSecond.roomNumber && <p>יש להזין מס’ חדר</p>}

                    <button type="submit">הרשם</button>
                </form>
            )}
        </div>
    );
}
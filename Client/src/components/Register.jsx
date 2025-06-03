import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { CurrentUser } from './App';
import Cookies from "js-cookie";
import { validateFirstRegisterStep, validateSecondRegisterStep } from '../../utils/userValidator';
import { signup } from '../../services/usersServices';
import '../style/Register.css';
// import { log } from '../../../Server/utils/logger';

function Register() {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const { register, handleSubmit: handleFirstSubmit, reset: resetFirstForm, watch, formState: { errors } } = useForm();
    const { register: registerSecond, handleSubmit: handleSecondSubmit, reset: resetSecondForm, watch: watchSecond, formState: { errors: errorsSecond } } = useForm();
    const [registerIsCompleted, setRegisterIsCompleted] = useState(0);
    const [responsText, setResponstText] = useState("Fill the form and click the sign up button");
    const { setCurrentUser } = useContext(CurrentUser);
    const [userData, setUserData] = useState({});
    const sectors = ["חרדי", "דתי", "חילוני", "מסורתי"];
    const hospitals = ["שיבא", "איכילוב", "הדסה עין כרם", "שערי צדק", "בלינסון", "ברזילי", "סורוקה"];
    const departments = ["פנימית", "אורתופדיה", "ילדים", "ניתוחים", "שיקום"];
    const relations = ["אבא", "אמא", "אח", "אחות", "סבא", "סבתא", "בן זוג", "בת זוג"];
    const availabilities = ["בוקר", "צהריים", "ערב", "לילה"];
    const transportMeans = ["רכב פרטי", "תחבורה ציבורית", "הליכה", "אופניים"];

    const onFirstSubmit = async (data) => {
        const error = validateFirstRegisterStep(data);
        if (error) {
            setResponstText(error);
            return;
        }
        setUserData({ fullName: data.fullName, email: data.email, password: data.password, verifyPassword: data.verifyPassword, type: userType });
        setRegisterIsCompleted(1);
        resetFirstForm();
    };

    const handleSignupSuccess = (createdUser) => {
        navigate(`/users/${createdUser.id}/home`);
        Cookies.set("token", createdUser.token);
        setCurrentUser(createdUser.user);
        localStorage.setItem("currentUser", JSON.stringify(createdUser.user));
    };

    const handleSignupFailure = () => {
        setResponstText("Registration failed. Please try again.");
    };

    const onSecondSubmit = async (data) => {
        console.log("Second step data:", data);
        console.log("User type is:", userType);
        const mergedData = {
            ...data,
            email: userData.email,
        };
        console.log("Merged data before validation:", mergedData);
        const error = validateSecondRegisterStep(mergedData);
        console.log("Validation error:", error);
        if (error) {
            setResponstText(error);
            return;
        }
        if (userType == "volunteer") {
            const fullUser = {
                id: Number(mergedData.userId),
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                phone: mergedData.phone,
                type: userType,
                dateOfBirth: mergedData.birthDate,
                gender: mergedData.gender,
                sector: mergedData.sector,
                address: mergedData.address,
                photo: "https://example.com/image.jpg",
                volunteerStartDate: new Date().toISOString(),
                volunteerEndDate: null,
                isActive: true,
                flexible: mergedData.availability === "true" ? true : false,
            };
            delete fullUser.verifyPassword;
            delete fullUser.name;
            await signup(
                fullUser,
                handleSignupSuccess,
                handleSignupFailure
            );
        }
        else if (userType == "contact") {
            const contactUser = {
                id: Number(mergedData.userId),
                email: userData.email,
                phone: mergedData.phone,
                type: userType,
                password: userData.password,
                fullName: userData.fullName,
                address: mergedData.address,
                patientFullName: mergedData.patientName,
                dateOfBirth: mergedData.birthDate,
                sector: mergedData.patientSector,
                gender: "male",
                address: mergedData.patientAddress,
                dateOfDeath: null,
                interestedInReceivingNotifications: !!mergedData.notifications,
                relationType: mergedData.relation,
                hospital: mergedData.hospital,
                department: mergedData.department,
                roomNumber: mergedData.roomNumber
            };
            console.log("Contact payload being sent:", contactUser);
            await signup(
                contactUser,
                handleSignupSuccess,
                handleSignupFailure
            );
        }
    };

    return (
        <div className="register-form">
            {registerIsCompleted == 0 && (
                <form onSubmit={handleFirstSubmit(onFirstSubmit)}>
                    <h2>שלב 1: הזנת פרטי משתמש בסיסיים</h2>
                    <input placeholder="fullName" {...register("fullName", { required: true })} />
                    {errors.fullName && <p>יש להזין שם משתמש</p>}
                    <input type="email" placeholder="email" {...register("email", { required: true })} />
                    {errors.email && <p>יש להזין מייל תקין</p>}
                    <input type="password" placeholder="password" {...register("password", { required: true, minLength: 6 })} />
                    {errors.password && <p>יש להזין סיסמה באורך מינימום 6 תווים</p>}
                    <input type="password" placeholder="אימות סיסמה"
                        {...register("verifyPassword", {
                            required: true,
                            validate: (value) => value === watch("password"),
                        })}
                    />
                    {errors.verifyPassword && <p>הסיסמאות אינן תואמות</p>}
                    <div>
                        <button type="button" onClick={() => setUserType("volunteer")}>אני מתנדב</button>
                        <button type="button" onClick={() => setUserType("contact")}>אני איש קשר</button>
                    </div>
                    {!userType && <p>יש לבחור סוג משתמש</p>}
                    <button type="submit" disabled={!userType}>המשך</button>
                </form>
            )}
            {registerIsCompleted == 1 && userType == "volunteer" && (
                <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
                    <h2>טופס מתנדב</h2>
                    <input placeholder="ת.ז." {...registerSecond("userId", { required: true })} />
                    {errorsSecond.userId && <p>יש להזין ת.ז.</p>}
                    <input value={userData.fullName} readOnly {...registerSecond("name", { required: true })} />
                    <input value={userData.email} readOnly {...registerSecond("email", { required: true })} />
                    <input
                        type="date"
                        placeholder="תאריך לידה"
                        {...registerSecond("birthDate", { required: true })}
                    />
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
                    <label>זמינות (ניתן לבחור יותר מאפשרות אחת):</label>
                    <input type="checkbox" {...registerSecond("availability")} value="true" id="availability" />
                    <label htmlFor="availability">האם זמין?</label>
                    <label>
                        <input type="checkbox" {...registerSecond("notifications")} />
                        מעוניין בהתראות
                    </label>
                    <button type="submit">הרשם</button>
                </form>
            )}
            {registerIsCompleted == 1 && userType == "contact" && (
                <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
                    <h2>טופס איש קשר</h2>
                    <input placeholder="ת.ז." {...registerSecond("userId", { required: true })} />
                    <input placeholder="טלפון" {...registerSecond("phone", { required: true })} />
                    <input placeholder="כתובת" {...registerSecond("address", { required: true })} />
                    <select {...registerSecond("relation", { required: true })}>
                        <option value="">בחר סוג קרבה</option>
                        {relations.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <h3>פרטי מטופל</h3>
                    <input placeholder="ת.ז." {...registerSecond("patientId", { required: true })} />
                    <input placeholder="שם" {...registerSecond("patientName", { required: true })} />
                    <input
                        type="date"
                        placeholder="תאריך לידה"
                        {...registerSecond("birthDate", { required: true })}
                    />
                    {errorsSecond.birthDate && <p>יש להזין תאריך לידה</p>}
                    <select {...registerSecond("patientGender", { required: true })}>
                        <option value="">בחר מין</option>
                        <option value="זכר">זכר</option>
                        <option value="נקבה">נקבה</option>
                    </select>
                    <select {...registerSecond("patientSector", { required: true })}>
                        <option value="">בחר מגזר</option>
                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input placeholder="כתובת" {...registerSecond("patientAddress", { required: true })} />
                    <label>
                        <input type="checkbox" {...registerSecond("notifications")} />
                        מעוניין בהתראות
                    </label>
                    <select {...registerSecond("hospital", { required: true })}>
                        <option value="">בחר בית חולים</option>
                        {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <select {...registerSecond("department", { required: true })}>
                        <option value="">בחר מחלקה</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input placeholder="מס' חדר" {...registerSecond("roomNumber", { required: true })} />
                    <button type="submit">הרשם</button>
                </form>
            )}
        </div>
    );
}

export default Register;
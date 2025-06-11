import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { CurrentUser } from './App';
import { CodesContext } from './CodesProvider';
import Cookies from "js-cookie";
import { validateFirstRegisterStep, validateSecondRegisterStep } from '../../utils/userValidator';
import { signup } from '../services/usersServices';
import '../style/Register.css';

function Register() {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const { register, handleSubmit: handleFirstSubmit, reset: resetFirstForm, watch, formState: { errors } } = useForm();
    const { register: registerSecond, handleSubmit: handleSecondSubmit, reset: resetSecondForm, watch: watchSecond, formState: { errors: errorsSecond } } = useForm();
    const [registerIsCompleted, setRegisterIsCompleted] = useState(0);
    const [responsText, setResponstText] = useState("Fill the form and click the sign up button");
    const { setCurrentUser } = useContext(CurrentUser);
    const { setCodesContext } = useContext(CodesContext);
    const [userData, setUserData] = useState({});
    const [showMoreForm, setShowMoreForm] = useState(false);

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
        console.log(`userType${userType.description}`);
        const user = createdUser.user;
        console.log("User created successfully:", user);
        Cookies.set("token", createdUser.token);
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate(`/${userType.description}/${user.id}`);
    };

    const handleSignupFailure = () => {
        setResponstText("Registration failed. Please try again.");
    };

    const onSecondSubmit = async (data) => {
        const mergedData = {
            ...data,
            email: userData.email,
        };
        const error = validateSecondRegisterStep(mergedData);
        console.log("Validation error:", error);
        if (error) {
            setResponstText(error);
            return;
        }
        if (userType.description == "Volunteer") {
            console.log("Registering as a volunteer with data:", mergedData);

            const user = {
                id: Number(mergedData.userId),
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                phone: mergedData.phone,
                type: userType.id,
                dateOfBirth: mergedData.birthDate,
                gender: Number(mergedData.gender),
                sector: Number(mergedData.sector),
                address: mergedData.address,
                volunteerStartDate: new Date().toISOString(),
                volunteerEndDate: null,
                isActive: true,
                preferredDepartments: mergedData.preferredDepartments.map(d => Number(d)),
                preferredHospitals: mergedData.preferredHospitals.map(h => Number(h)),
                helpTypes: mergedData.helpTypes.map(h => Number(h)),
                guardSectors: mergedData.guardSectors.map(s => Number(s)),
                guardGenders: mergedData.guardGenders.map(g => Number(g)),
                isFlexible: mergedData.isFlexible == "true",
            };
            delete user.verifyPassword;
            await signup(
                user,
                handleSignupSuccess,
                handleSignupFailure
            );
        }
        else if (userType.description == "contact") {
            const contactUser = {
                id: Number(mergedData.userId),
                email: userData.email,
                phone: mergedData.phone,
                type: Number(userType.id),
                password: userData.password,
                fullName: userData.fullName,
                address: mergedData.address,
                patientId: Number(mergedData.patientId),
                patientFullName: mergedData.patientName,
                patientDateOfBirth: mergedData.birthDate,
                patientSector: mergedData.sector,
                patientGender: mergedData.gender,
                patientAddress: mergedData.patientAddress,
                patientDateOfDeath: null,
                patientInterestedInReceivingNotifications: !!mergedData.notifications,

                relationId: Number(mergedData.relationId),

                hospital: mergedData.hospital,
                department: mergedData.department,
                roomNumber: mergedData.roomNumber
            };

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
                        {CodesContext["UserTypes"]?.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setUserType({ id: item.id, description: item.description })}
                            >
                                {item.description}
                            </button>
                        ))}
                    </div>
                    {!userType && <p>יש לבחור סוג משתמש</p>}
                    <button type="submit" disabled={!userType}>המשך</button>
                </form>
            )}
            {registerIsCompleted == 1 && userType.description == "Volunteer" && (
                <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
                    <h2>טופס מתנדב</h2>
                    <input placeholder="ת.ז." {...registerSecond("userId", { required: true })} />
                    {errorsSecond.userId && <p>יש להזין ת.ז.</p>}
                    <input value={userData.fullName} readOnly {...registerSecond("fullName", { required: true })} />
                    <input value={userData.email} readOnly {...registerSecond("email", { required: true })} />
                    <input
                        type="date"
                        placeholder="תאריך לידה"
                        {...registerSecond("birthDate", { required: true })}
                    />
                    {errorsSecond.birthDate && <p>יש להזין תאריך לידה</p>}
                    <input placeholder="טלפון" {...registerSecond("phone", { required: true })} />
                    {errorsSecond.phone && <p>יש להזין טלפון</p>}
                    <input placeholder="כתובת" {...registerSecond("address", { required: true })} />
                    {errorsSecond.address && <p>יש להזין כתובת</p>}
                    {errorsSecond.gender && <p>יש לבחור מין</p>}
                    <select {...registerSecond("gender", { required: true })}>
                        <option value="">בחר מגדר</option>
                        {CodesContext["Genders"]?.map((item) => (
                            <option key={item.id} value={item.id}>{item.description}</option>
                        ))}
                    </select>
                    {errorsSecond.gender && <p>יש לבחור מגזר</p>}
                    <select {...registerSecond("sector", { required: true })}>
                        <option value="">בחר מגזר</option>
                        {CodesContext["Sectors"]?.map((item) => (
                            <option key={item.id} value={item.id}>{item.description}</option>
                        ))}
                    </select>
                    <label>תחומי התנדבות:</label>
                    <div>
                        {CodesContext["VolunteeringTypes"]?.map((item) => (
                            <div key={item.id}>
                                <input
                                    type="checkbox"
                                    {...registerSecond("helpTypes", { required: true })}
                                    value={item.id}
                                    id={`help-${item.id}`}
                                />
                                <label htmlFor={`help-${item.id}`}>{item.description}</label>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => setShowMoreForm(true)}>
                        המשך מילוי פרטים נוספים
                    </button>
                    {showMoreForm && (
                        <div className="more-form">
                            <h3>פרטים נוספים</h3>
                            <label>מחלקות בהן מוכן להתנדב</label>
                            {CodesContext["Departments"]?.map((item) => (
                                <div key={item.id}>
                                    <input
                                        type="checkbox"
                                        {...registerSecond("preferredDepartments")}
                                        value={item.id}
                                        id={`dept-${item.id}`}
                                    />
                                    <label htmlFor={`dept-${item.id}`}>{item.description}</label>
                                </div>
                            ))}
                            <label>בתי חולים בהן מוכן להתנדב</label>
                            {CodesContext["Hospitals"]?.map((item) => (
                                <div key={item.id}>
                                    <input
                                        type="checkbox"
                                        {...registerSecond("preferredHospitals")}
                                        value={item.id}
                                        id={`hospital-${item.id}`}
                                    />
                                    <label htmlFor={`hospital-${item.id}`}>{item.description}</label>
                                </div>
                            ))}
                            <label>מגזרים עליהם מוכן לשמור</label>
                            {CodesContext["Sectors"]?.map((item) => (
                                <div key={item.id}>
                                    <input
                                        type="checkbox"
                                        {...registerSecond("guardSectors")}
                                        value={item.id}
                                        id={`guard-sector-${item.id}`}
                                    />
                                    <label htmlFor={`guard-sector-${item.id}`}>{item.description}</label>
                                </div>
                            ))}
                            <label>מגדרים עליהם מוכן לשמור</label>
                            {CodesContext["Genders"]?.map((item) => (
                                <div key={item.id}>
                                    <input
                                        type="checkbox"
                                        {...registerSecond("guardGenders")}
                                        value={item.id}
                                        id={`guard-gender-${item.id}`}
                                    />
                                    <label htmlFor={`guard-gender-${item.id}`}>{item.description}</label>
                                </div>
                            ))}
                            <label>האם הוא גמיש בשעות?</label>
                            <div>
                                <input
                                    type="radio"
                                    {...registerSecond("isFlexible")}
                                    value="true"
                                    id="flexible-yes"
                                />
                                <label htmlFor="flexible-yes">כן</label>
                                <input
                                    type="radio"
                                    {...registerSecond("isFlexible")}
                                    value="false"
                                    id="flexible-no"
                                />
                                <label htmlFor="flexible-no">לא</label>
                            </div>
                            {/* <label>באילו שעות מוכן להתנדב?</label>
                            {CodesContext["VolunteerDiaries"]?.map((item) => (
                                <div key={item.id}>
                                    <input
                                        type="checkbox"
                                        {...registerSecond("volunteerTimes")}
                                        value={item.id}
                                        id={`diary-${item.id}`}
                                    />
                                    <label htmlFor={`diary-${item.id}`}>{item.description}</label>
                                </div>
                            ))} */}
                        </div>
                    )}
                    <button type="submit">הרשם</button>
                </form>
            )}
            {registerIsCompleted == 1 && userType.description == "Contact" && (
                <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
                    <h2>טופס איש קשר</h2>
                    <input placeholder="ת.ז." {...registerSecond("userId", { required: true })} />
                    <input value={userData.fullName} readOnly {...registerSecond("fullName", { required: true })} />
                    <input value={userData.email} readOnly {...registerSecond("email", { required: true })} />
                    <input placeholder="טלפון" {...registerSecond("phone", { required: true })} />
                    <input placeholder="כתובת" {...registerSecond("address", { required: true })} />
                    <select {...registerSecond("relationId", { required: true })}>
                        <option value="">-- בחר --</option>
                        {familyRelations.map((relation, idx) => (
                            <option key={idx} value={idx + 1}>
                                {relation}
                            </option>
                        ))}
                    </select>
                    {errorsSecond.relationId && <p>יש לבחור קרבה משפחתית</p>}
                    <h3>פרטי מטופל</h3>
                    <input placeholder="ת.ז." {...registerSecond("patientId", { required: true })} />
                    <input placeholder="שם" {...registerSecond("patientName", { required: true })} />
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
                    <select {...registerSecond("sector", { required: true })}>
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
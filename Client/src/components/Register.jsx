import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { CurrentUser } from './App';
import { CodesContext } from './Models';
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
    const { codes, loading } = useContext(CodesContext);

    const onFirstSubmit = async (data) => {
        const error = validateFirstRegisterStep(data);
        if (error) {
            setResponstText(error);
            return;
        }
        setUserData({ fullName: data.fullName, email: data.email, password: data.password, verifyPassword: data.verifyPassword, type: userType });
        console.log("userData", userData);

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
        else if (userType.description == "ContactPerson") {
            const contactUser = {
                id: Number(mergedData.userId),
                email: userData.email,
                phone: mergedData.phone,
                type: userType.id,
                password: userData.password,
                fullName: userData.fullName,
                address: mergedData.address,
                patientId: Number(mergedData.patientId),
                contactPeopleId: Number(mergedData.userId),
                patientFullName: mergedData.patientName,
                patientDateOfBirth: mergedData.birthDate,
                patientSector: mergedData.sector,
                patientGender: mergedData.gender,
                patientAddress: mergedData.patientAddress,
                dateOfDeath: null,
                patientInterestedInReceivingNotifications: !!mergedData.notifications,
                relationId: Number(mergedData.relationId),
                hospital: mergedData.hospital,
                department: mergedData.department,
                roomNumber: mergedData.roomNumber,
                hospitalizationStart: mergedData.hospitalizationStart,
                hospitalizationEnd: null
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
                    <h2>Enter basic user information</h2>
                    <input placeholder="fullName" {...register("fullName", { required: true })} />
                    {errors.fullName && <p>A username must be entered</p>}
                    <input type="email" placeholder="email" {...register("email", { required: true })} />
                    {errors.email && <p>You must enter a valid email</p>}
                    <input type="password" placeholder="password" {...register("password", { required: true, minLength: 6 })} />
                    {errors.password && <p>You must enter a password with a minimum length of 6 characters</p>}                    <input type="password" placeholder="אימות סיסמה"
                        {...register("verifyPassword", {
                            required: true,
                            validate: (value) => value === watch("password"),
                        })}
                    />
                    {errors.verifyPassword && <p>The passwords do not match</p>}
                    <div>
                        {codes?.UserTypes?.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setUserType({ id: item.id, description: item.description })}
                            >
                                {item.description}
                            </button>
                        ))}
                    </div>
                    {!userType && <p>You must select a user type</p>}
                    <button type="submit" disabled={!userType}>המשך</button>
                </form>
            )}
            {registerIsCompleted == 1 && userType.description == "Volunteer" && (
                <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
                    <h2>Volunteer Form</h2>
                    <input placeholder="ID" {...registerSecond("userId", { required: true })} />
                    {errorsSecond.userId && <p>You must enter an ID.</p>}
                    <input value={userData.fullName} readOnly {...registerSecond("fullName", { required: true })} />
                    <input value={userData.email} readOnly {...registerSecond("email", { required: true })} />
                    <input
                        type="date"
                        placeholder="Birth date"
                        {...registerSecond("birthDate", { required: true })}
                    />
                    {errorsSecond.birthDate && <p>A birth date must be entered</p>}
                    <input placeholder="Phone" {...registerSecond("phone", { required: true })} />
                    {errorsSecond.phone && <p>A phone number must be entered</p>}
                    <input placeholder="Address" {...registerSecond("address", { required: true })} />
                    {errorsSecond.address && <p>An address must be entered</p>}
                    <select {...registerSecond("gender", { required: true })}>
                        <option value="">Select a gender</option>
                        {codes?.Genders?.map((item) => (
                            <option key={item.id} value={item.id}>{item.description}</option>
                        ))}
                    </select>
                    {errorsSecond.gender && <p>You must select a gender</p>}
                    {errorsSecond.gender && <p>You must select a sector</p>}
                    <select {...registerSecond("sector", { required: true })}>
                        <option value="">Select a sector</option>
                        {codes?.Sectors?.map((item) => (
                            <option key={item.id} value={item.id}>{item.description}</option>
                        ))}
                    </select>
                    <label>Volunteering Areas:</label>
                    <div>
                        {codes?.VolunteeringTypes?.map((item) => (
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
                    <button type="button" onClick={() => setShowMoreForm(true)}></button>
                    {showMoreForm && (
                        <div className="more-form">
                            <h3>Additional Details</h3>
                            <label>Departments I am willing to volunteer in</label>
                            {codes?.Departments?.map((item) => (
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
                            <label>Hospitals where I am willing to volunteer</label>                            {codes?.Hospitals?.map((item) => (
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
                            <label>Sectors I am willing to keep</label>
                            {codes?.Sectors?.map((item) => (
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
                            <label>Genders I am willing to maintain</label>
                            {codes?.Genders?.map((item) => (
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
                            <label>Flexibility in hours</label>
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
                    <button type="submit">Sign Up</button>
                </form>
            )}
            {registerIsCompleted == 1 && userType.description == "ContactPerson" && (
                <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
                    <h2>Contact form</h2>
                    <input placeholder="T.Z." {...registerSecond("userId", { required: true })} />
                    <input value={userData.fullName} readOnly {...registerSecond("fullName", { required: true })} />
                    <input value={userData.email} readOnly {...registerSecond("email", { required: true })} />
                    <input placeholder="phone" {...registerSecond("phone", { required: true })} />
                    <input placeholder="address" {...registerSecond("address", { required: true })} />
                    <label>family closeness</label>
                    {codes?.FamilyRelations?.map((item) => (
                        <div key={item.id}>
                            <input
                                type="radio"
                                {...registerSecond("relationId")}
                                value={item.id}
                                id={`FamilyRelations-${item.id}`}
                            />
                            <label htmlFor={`guard-FamilyRelations-${item.id}`}>{item.description}</label>
                        </div>
                    ))}
                    {errorsSecond.relationId && <p>Must select a family relationship</p>}
                    <h3>Patient details</h3>
                    <input placeholder="ID" {...registerSecond("patientId", { required: true })} />
                    <input placeholder="Name" {...registerSecond("patientName", { required: true })} />
                    <input
                        type="date"
                        placeholder="Date of birth"
                        {...registerSecond("birthDate", { required: true })}
                    />
                    {errorsSecond.birthDate && <p>Must enter a date of birth</p>}
                    <label> Gender </label>
                    {codes?.Genders?.map((item) => (
                        <div key={item.id}>
                            <input
                                type="radio"
                                {...registerSecond("gender")}
                                value={item.id}
                                id={`guard-gender-${item.id}`}
                            />
                            <label htmlFor={`guard-gender-${item.id}`}>{item.description}</label>
                        </div>
                    ))}
                    <label>Sector</label>
                    {codes?.Sectors?.map((item) => (
                        <div key={item.id}>
                            <input
                                type="radio"
                                {...registerSecond("sector")}
                                value={item.id}
                                id={`guard-sector-${item.id}`}
                            />
                            <label htmlFor={`guard-sector-${item.id}`}>{item.description}</label>
                        </div>
                    ))}
                    <input placeholder="address" {...registerSecond("patientAddress", { required: true })} />
                    <label>
                        <input type="checkbox" {...registerSecond("notifications")} />
                        interested in notifications
                    </label>
                    <label>Choose a hospital</label>
                    {codes?.Hospitals?.map((item) => (
                        <div key={item.id}>
                            <input
                                type="radio"
                                {...registerSecond("hospital")}
                                value={item.id}
                                id={`Hospitals-${item.id}`}
                            />
                            <label htmlFor={`Hospitals-${item.id}`}>{item.description}</label>
                        </div>
                    ))}
                    <label>Choose a department</label>
                    {codes?.Departments?.map((item) => (
                        <div key={item.id}>
                            <input
                                type="radio"
                                {...registerSecond("department")}
                                value={item.id}
                                id={`Departments-${item.id}`}
                            />
                            <label htmlFor={`Departments-${item.id}`}>{item.description}</label>
                        </div>
                    ))}
                    <input placeholder="Room Number" {...registerSecond("roomNumber", { required: true })} />
                    <input placeholder="hospitalization Start" {...registerSecond("hospitalizationStart", { required: true })} />
                    <button type="submit">Subscribe</button>
                </form>
            )}
        </div>
    );
}
export default Register;
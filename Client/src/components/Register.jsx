import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { CurrentUser } from './App';
import { useCodes } from "./Models";
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
    const [userData, setUserData] = useState({});
    const [showMoreForm, setShowMoreForm] = useState(false);
    const { codes, loading } = useCodes();

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
        const user = createdUser.user;
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
        if (error) {
            setResponstText(error);
            return;
        }
        if (userType.description == "Volunteer") {
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
                helpTypes: mergedData.helpTypes?.map(h => Number(h)),
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
        <div className="back-ground-img">
            <div>
                {registerIsCompleted == 0 && (
                    <div className="entryContainer">
                        <form onSubmit={handleFirstSubmit(onFirstSubmit)} className="entryForm">
                            <h2>Sign Up</h2>
                            <input type="fullName" placeholder="fullName" {...register("fullName", { required: true })} />
                            {errors.fullName && <p>A username must be entered</p>}
                            <input type="email" placeholder="email" {...register("email", { required: true })} />
                            {errors.email && <p>You must enter a valid email</p>}
                            <input type="password" placeholder="password" {...register("password", { required: true, minLength: 6 })} />
                            {errors.password && <p>You must enter a password with a minimum length of 6 characters</p>}
                            <input type="password" placeholder="password verification"{...register("verifyPassword", { required: true, validate: (value) => value === watch("password"), })} />
                            {errors.verifyPassword && <p>The passwords do not match</p>}
                            {!userType && <p>You must select a user type</p>}
                            <div>
                                {codes?.UserTypes?.map((item) => (
                                    <button
                                        className='typeBtn'
                                        key={item.id}
                                        type="button"
                                        onClick={() => setUserType({ id: item.id, description: item.description })}
                                    >
                                        {item.description}
                                    </button>
                                ))}
                            </div>
                            <button type="submit" disabled={!userType}>continue</button>
                        </form>
                    </div>
                )}
                {registerIsCompleted == 1 && userType.description == "Volunteer" && (
                    <div className="entryContainer">
                        <form onSubmit={handleSecondSubmit(onSecondSubmit)} className="entryForm">
                            <h2>Volunteer Form</h2>
                            <input placeholder="ID" {...registerSecond("userId", { required: true })} />
                            {errorsSecond.userId && <p>You must enter an ID.</p>}
                            <input value={userData.fullName} readOnly {...registerSecond("fullName", { required: true })} />
                            <input value={userData.email} readOnly {...registerSecond("email", { required: true })} />
                            <input type="date" placeholder="Birth date" {...registerSecond("birthDate", { required: true })} />
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
                            <button type="button" onClick={() => setShowMoreForm(true)}>More details</button>
                            {showMoreForm && (
                                <div className="more-form">
                                    <h4>Departments I am willing to volunteer in</h4>
                                    <div className='preference'>
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
                                    </div>
                                    <h4>Hospitals where I am willing to volunteer</h4>
                                    <div className='preference'>
                                        {codes?.Hospitals?.map((item) => (
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
                                    </div>
                                    <h4>Sectors I am willing to keep</h4>
                                    <div className='preference'>
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
                                    </div>
                                    <h4>Genders I am willing to maintain</h4>
                                    <div className='preference'>
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
                                    </div>
                                    <h4>Flexibility in hours</h4>
                                    <div className='preference'>
                                        <div>
                                            <input
                                                type="radio"
                                                {...registerSecond("isFlexible")}
                                                value="true"
                                                id="flexible-yes"
                                            />
                                            <label htmlFor="flexible-yes">Yes</label>
                                            <input
                                                type="radio"
                                                {...registerSecond("isFlexible")}
                                                value="false"
                                                id="flexible-no"
                                            />
                                            <label htmlFor="flexible-no">No</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button type="submit">Sign Up</button>
                        </form>
                    </div>
                )}
                {registerIsCompleted == 1 && userType.description == "ContactPerson" && (
                    <div className="entryContainer">
                        <form onSubmit={handleSecondSubmit(onSecondSubmit)} className="entryForm">
                            <h2>Contact form</h2>
                            <input placeholder="ID" {...registerSecond("userId", { required: true })} />
                            <input value={userData.fullName} readOnly {...registerSecond("fullName", { required: true })} />
                            <input value={userData.email} readOnly {...registerSecond("email", { required: true })} />
                            <input placeholder="phone" {...registerSecond("phone", { required: true })} />
                            <input placeholder="address" {...registerSecond("address", { required: true })} />
                            <h4>Family Closeness</h4>
                            <div className="preference">
                                {codes?.FamilyRelations?.map((item) => (
                                    <div key={item.id}>
                                        <input
                                            type="radio"
                                            {...registerSecond("relationId")}
                                            value={item.id}
                                            id={`FamilyRelations-${item.id}`}
                                        />
                                        <label htmlFor={`FamilyRelations-${item.id}`}>{item.description}</label>
                                    </div>
                                ))}
                            </div>
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
                            <h4>Gender</h4>
                            <div className="preference">
                                {codes?.Genders?.map((item) => (
                                    <div key={item.id}>
                                        <input
                                            type="radio"
                                            {...registerSecond("gender")}
                                            value={item.id}
                                            id={`gender-${item.id}`}
                                        />
                                        <label htmlFor={`gender-${item.id}`}>{item.description}</label>
                                    </div>
                                ))}
                            </div>
                            <h4>Sector</h4>
                            <div className="preference">
                                {codes?.Sectors?.map((item) => (
                                    <div key={item.id}>
                                        <input
                                            type="radio"
                                            {...registerSecond("sector")}
                                            value={item.id}
                                            id={`sector-${item.id}`}
                                        />
                                        <label htmlFor={`sector-${item.id}`}>{item.description}</label>
                                    </div>
                                ))}
                            </div>
                            <input placeholder="address" {...registerSecond("patientAddress", { required: true })} />
                            <div className="preference">
                                <label>
                                    <input type="checkbox" {...registerSecond("notifications")} />
                                    Interested in notifications
                                </label>
                            </div>
                            <h4>Choose a hospital</h4>
                            <div className="preference">
                                {codes?.Hospitals?.map((item) => (
                                    <div key={item.id}>
                                        <input
                                            type="radio"
                                            {...registerSecond("hospital")}
                                            value={item.id}
                                            id={`hospital-${item.id}`}
                                        />
                                        <label htmlFor={`hospital-${item.id}`}>{item.description}</label>
                                    </div>
                                ))}
                            </div>
                            <h4>Choose a department</h4>
                            <div className="preference">
                                {codes?.Departments?.map((item) => (
                                    <div key={item.id}>
                                        <input
                                            type="radio"
                                            {...registerSecond("department")}
                                            value={item.id}
                                            id={`department-${item.id}`}
                                        />
                                        <label htmlFor={`department-${item.id}`}>{item.description}</label>
                                    </div>
                                ))}
                            </div>
                            <input placeholder="Room Number" {...registerSecond("roomNumber", { required: true })} />
                            <input
                                type="date"
                                placeholder="Hospitalization Start"
                                {...registerSecond("hospitalizationStart", { required: true })}
                            />
                            <button type="submit">Sign Up</button>
                        </form>
                    </div>
                )}

            </div>
        </div >
    );
}

export default Register;
import React, { useState, useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { CodesContext } from '../Models';
import { CurrentUser } from '../App';
import {
    useProfileData,
    useEditModeFromSessionStorage,
    sendEditRequest,
    updateProfile,
    handleVerifyCode
} from '../ProfileManagement';

function ContactPatientProfile() {
    const { codes, loading } = useContext(CodesContext);
    const { currentUser } = useContext(CurrentUser);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState("");
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useEditModeFromSessionStorage();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    const dataArray = useProfileData('patients', reset);

    useEffect(() => {
        if (Array.isArray(dataArray) && dataArray.length > 0) {
            const profile = dataArray[0];
            setProfileData(profile);
            reset(profile); // איתחול שדות הטופס
            const defaultPatient = normalizePatientData(dataArray[0]);
            setProfileData(defaultPatient);
            reset(defaultPatient);
        }
    }, [dataArray, reset]);
    const normalizePatientData = (patient) => {
        const hosp = patient.Hospitalizeds?.[0];
        return {
            ...patient,
            dateOfBirth: patient.dateOfBirth?.slice(0, 10),
            hospitalId: hosp?.hospital ?? '',
            departmentId: hosp?.department ?? ''
        };
    };

    const onSubmit = async (formData) => {
        try {
            await updateProfile(currentUser.id, "ContactPerson", "patients", currentUser.autoId, formData);
            await updateProfile(`patients/${profileData.id}`, setIsEditing, formData);
            alert("Profile updated successfully.");
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update profile.");
        }
    };

    const handleRequestEdit = async () => {
        try {
            await sendEditRequest(setShowCodeInput);
            alert("A verification code has been sent to your email.");
        } catch (err) {
            console.error("Sending email failed:", err);
            alert("Failed to send verification email.");
        }
    };

    const onVerifyCode = async () => {
        await handleVerifyCode(code, setIsEditing, setShowCodeInput, currentUser);
    };
    if (!profileData || loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Patient Profile</h2>
            {!isEditing && <button onClick={handleRequestEdit}>Patient Edit</button>}

            {!isEditing && showCodeInput && (
                <div>
                    <input
                        placeholder="Enter verification code from email"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={onVerifyCode}>Verify</button>
                </div>
            )}

            {dataArray.length > 1 && (
                <div>
                    <label>בחר פציינט:</label>
                    <select
                        value={profileData.id}
                        onChange={(e) => {
                            const selectedRaw = dataArray.find(p => p.id === parseInt(e.target.value));
                            const selected = normalizePatientData(selectedRaw);
                            setProfileData(selected);
                            reset(selected);
                        }}
                        disabled={isEditing}
                    >
                        {dataArray.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.fullName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    placeholder="Full Name"
                    {...register("fullName", { required: true })}
                    readOnly={!isEditing}
                />
                {errors.fullName && <p>Required</p>}

                <input
                    type="date"
                    placeholder="Birth Date"
                    {...register("dateOfBirth", { required: true })}
                    readOnly={!isEditing}
                />
                {errors.dateOfBirth && <p>Required</p>}

                <input
                    placeholder="Address"
                    {...register("address", { required: true })}
                    readOnly={!isEditing}
                />
                {errors.address && <p>Required</p>}

                <select {...register("gender", { required: true })} disabled={!isEditing}>
                    <option value="">Select Gender</option>
                    {codes?.Genders?.map((g) => (
                        <option key={g.id} value={g.id}>{g.description}</option>
                    ))}
                </select>

                <select {...register("sector", { required: true })} disabled={!isEditing}>
                    <option value="">Select Sector</option>
                    {codes?.Sectors?.map((s) => (
                        <option key={s.id} value={s.id}>{s.description}</option>
                    ))}
                </select>
                    { isEditing && <button type="submit">Update</button>}

                {/* {/* <select {...register("departmentId", { required: true })} disabled={!isEditing}>
                    <option value="">Select Department</option>
                    {codes?.Departments?.map((d) => (
                        <option key={d.id} value={d.id}>{d.description}</option>
                                    <option key={d.id} value={d.id}>{d.description}</option>Add commentMore actions
                    ))}
                </select>

                <select {...register("hospitalId", { required: true })} disabled={!isEditing}>
                    <option value="">Select Hospital</option>
                    {codes?.Hospitals?.map((h) => (
                        <option key={h.id} value={h.id}>{h.description}</option>
                    ))}
                </select>*/}
            </form>
        </div>
    );
}

export default ContactPatientProfile;
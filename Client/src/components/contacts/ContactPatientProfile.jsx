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
            reset(profile);
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
        <div className="entryContainer">
            <form onSubmit={handleSubmit(onSubmit)} className="entryForm">
                <h2>Patient Profile</h2>
                {!isEditing && (
                    <button type="button" onClick={handleRequestEdit}>Patient Edit</button>
                )}
                {!isEditing && showCodeInput && (
                    <div>
                        <input
                            className="entryForm-input"
                            placeholder="Enter verification code from email"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button type="button" onClick={onVerifyCode}>Verify</button>
                    </div>
                )}
                {dataArray.length > 1 && (
                    <div>
                        <label>Choose Patient:</label>
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
                <input
                    placeholder="Full Name"
                    {...register("fullName", { required: true })}
                    readOnly={!isEditing}
                />
                {errors.fullName && <p className="error">Required</p>}
                <input
                    type="date"
                    placeholder="Birth Date"
                    {...register("dateOfBirth", { required: true })}
                    readOnly={!isEditing}
                />
                {errors.dateOfBirth && <p className="error">Required</p>}
                <input
                    placeholder="Address"
                    {...register("address", { required: true })}
                    readOnly={!isEditing}
                />
                {errors.address && <p className="error">Required</p>}
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
                {isEditing && <button type="submit">Update</button>}
            </form>
        </div>
    );
}

export default ContactPatientProfile;
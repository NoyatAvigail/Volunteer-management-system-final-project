import React, { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import { userService } from '../../services/usersServices';
import { CurrentUser } from '../App';
import { CodesContext } from '../Models';

function ContactPersonProfile() {
    const { codes } = useContext(CodesContext);
    const { currentUser } = useContext(CurrentUser);
    const [initialData, setInitialData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        async function fetchProfile() {
            const data = await userService.getProfile(currentUser.id);
            setInitialData(data);
            console.log("data:", data);

            const formValues = {};
            for (const key in data) {
                if (typeof data[key] !== 'object') {
                    formValues[key] = data[key];
                }
            }

            if (data.user) {
                for (const key in data.user) {
                    formValues[key] = data.user[key];
                }
            }

            if (data.birthDate) {
                formValues.birthDate = data.birthDate.split('T')[0];
            }

            reset(formValues);
        }

        fetchProfile();
    }, [currentUser.id, reset]);

    useEffect(() => {
        const canEdit = sessionStorage.getItem("canEdit");
        if (canEdit === "true") {
            setIsEditing(true);
            sessionStorage.removeItem("canEdit");
        }
    }, []);

    const handleVerifyCode = async () => {
        try {
            await userService.verifyEditCode({ code });
            setIsEditing(true);
            setShowCodeInput(false);
            alert("Verification successful. You may now edit the profile.");
        } catch {
            alert("Invalid or expired code.");
        }
    };

    const handleRequestEdit = async () => {
        try {
            await userService.sendEditEmail(currentUser.id);
            alert("Verification email sent.");
            setShowCodeInput(true);
        } catch {
            alert("Failed to send email.");
        }
    };

    const onSubmit = async (formData) => {
        try {
            await userService.updateProfile(currentUser.id, formData);
            alert("Profile updated successfully.");
            setIsEditing(false);
            setInitialData(formData);
        } catch (err) {
            alert("Error updating profile.");
        }
    };

    if (!initialData) return <div>Loading profile...</div>;

    return (
        <div>
            <h2>Contact Person Profile</h2>

            {!isEditing && <button onClick={handleRequestEdit}>Edit Profile</button>}
            {!isEditing && showCodeInput && (
                <div>
                    <input
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={handleVerifyCode}>Verify</button>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="ID" {...register("userId", { required: true })} readOnly={!isEditing} />
                <input placeholder="Full Name" {...register("fullName", { required: true })} readOnly={!isEditing} />
                <input placeholder="Email" {...register("email", { required: true })} readOnly={!isEditing} />
                <input placeholder="Phone" {...register("phone", { required: true })} readOnly={!isEditing} />
                <input placeholder="Address" {...register("address", { required: true })} readOnly={!isEditing} />

                <label>Family Relation</label>
                {codes?.FamilyRelations?.map((item) => (
                    <div key={item.id}>
                        <input
                            type="radio"
                            {...register("relationId", { required: true })}
                            value={item.id}
                            id={`relation-${item.id}`}
                            disabled={!isEditing}
                        />
                        <label htmlFor={`relation-${item.id}`}>{item.description}</label>
                    </div>
                ))}
                {errors.relationId && <p>Please select a relation</p>}

                <h3>Patient Info</h3>
                <input placeholder="Patient ID" {...register("patientId", { required: true })} readOnly={!isEditing} />
                <input placeholder="Patient Name" {...register("patientName", { required: true })} readOnly={!isEditing} />
                <input type="date" {...register("birthDate", { required: true })} readOnly={!isEditing} />
                <input placeholder="Patient Address" {...register("patientAddress", { required: true })} readOnly={!isEditing} />

                <label>Gender</label>
                {codes?.Genders?.map((item) => (
                    <div key={item.id}>
                        <input
                            type="radio"
                            {...register("gender", { required: true })}
                            value={item.id}
                            id={`gender-${item.id}`}
                            disabled={!isEditing}
                        />
                        <label htmlFor={`gender-${item.id}`}>{item.description}</label>
                    </div>
                ))}

                <label>Sector</label>
                {codes?.Sectors?.map((item) => (
                    <div key={item.id}>
                        <input
                            type="radio"
                            {...register("sector", { required: true })}
                            value={item.id}
                            id={`sector-${item.id}`}
                            disabled={!isEditing}
                        />
                        <label htmlFor={`sector-${item.id}`}>{item.description}</label>
                    </div>
                ))}

                <label>Hospital</label>
                {codes?.Hospitals?.map((item) => (
                    <div key={item.id}>
                        <input
                            type="radio"
                            {...register("hospital", { required: true })}
                            value={item.id}
                            id={`hospital-${item.id}`}
                            disabled={!isEditing}
                        />
                        <label htmlFor={`hospital-${item.id}`}>{item.description}</label>
                    </div>
                ))}

                <label>Department</label>
                {codes?.Departments?.map((item) => (
                    <div key={item.id}>
                        <input
                            type="radio"
                            {...register("department", { required: true })}
                            value={item.id}
                            id={`department-${item.id}`}
                            disabled={!isEditing}
                        />
                        <label htmlFor={`department-${item.id}`}>{item.description}</label>
                    </div>
                ))}

                <input
                    placeholder="Room Number"
                    {...register("roomNumber", { required: true })}
                    readOnly={!isEditing}
                />

                <input
                    type="date"
                    placeholder="Hospitalization Start Date"
                    {...register("hospitalizationStart", { required: true })}
                    readOnly={!isEditing}
                />

                <label>
                    <input type="checkbox" {...register("notifications")} disabled={!isEditing} />
                    Receive Notifications
                </label>

                {isEditing && <button type="submit">Save Changes</button>}
            </form>
        </div>
    );
}

export default ContactPersonProfile;

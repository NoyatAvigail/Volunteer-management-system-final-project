import React, { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import { userService } from '../../services/usersServices';
import { CurrentUser } from '../App';
import { useCodes } from '../Models';
import {
    useProfileData,
    useEditModeFromSessionStorage,
    sendEditRequest,
    updateProfile,
    handleVerifyCode
} from '../ProfileManagement';

function ContactPersonProfile() {
    const { codes, loading } = useCodes();
    const { currentUser } = useContext(CurrentUser);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm();

    const initialData = useProfileData(currentUser.id, 'ContactPerson', 'profile', reset);
    const [isEditing, setIsEditing] = useEditModeFromSessionStorage();

    const onSubmit = async (formData) => {
        try {
            await updateProfile(currentUser.id, "ContactPerson", 'profile', currentUser.autoId,formData);
            alert("Profile updated successfully.");
            setIsEditing(false);
        } catch (err) {
            alert("Error updating profile.");
        }
    };

    const handleRequestEdit = async () => {
        try {
            await sendEditRequest(currentUser.id, currentUser.email);
            alert("Verification email sent.");
            setShowCodeInput(true);
        } catch {
            alert("Failed to send email.");
        }
    };

    const verifyCode = async () => {
        await handleVerifyCode(code, setIsEditing, setShowCodeInput, currentUser);
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
                    <button onClick={verifyCode}>Verify</button>
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
                {isEditing && <button type="submit">Save Changes</button>}
            </form>
        </div>
    );
}

export default ContactPersonProfile;

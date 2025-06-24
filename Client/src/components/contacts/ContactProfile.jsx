import React, { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import { CodesContext } from '../Models';
import { CurrentUser } from '../App';
import '../../style/ContactProfile.css';
import {
  useProfileData,
  useEditModeFromSessionStorage,
  updateProfile,
  handleVerifyCode,
  sendEditRequest
} from '../ProfileManagement';

function ContactPersonProfile() {
  const [isEditing, setIsEditing] = useEditModeFromSessionStorage();
  const { codes, loading } = useContext(CodesContext);
  const { currentUser } = useContext(CurrentUser);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();
  const initialData = useProfileData("", reset);

  const onSubmit = async (formData) => {
    try {
      await updateProfile("", setIsEditing, formData);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

  const handleRequestEdit = async () => {
    try {
      await sendEditRequest(setShowCodeInput);
      alert("Verification email sent.");
    } catch (e) {
      alert("Failed to send email.");
    }
  };

  const verifyCode = async () => {
    try {
      await handleVerifyCode(code, setIsEditing, setShowCodeInput);
    } catch (e) {
      alert("Verification failed.");
    }
  };

  if (!initialData) return <div>Loading profile...</div>;

  return (
    <div className="entryContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="entryForm">
        <h2>Contact Person Profile</h2>
        {!isEditing && <button onClick={handleRequestEdit}>Edit Profile</button>}
        {!isEditing && showCodeInput && (
          <div>
            <input
              className="entryForm-input"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={verifyCode}>Verify</button>
          </div>
        )}
        <input
          placeholder="ID"
          {...register("userId", { required: true })}
          readOnly={!isEditing}
        />
        <input
          placeholder="Full Name"
          {...register("fullName", { required: true })}
          readOnly={!isEditing}
        />
        <input
          placeholder="Email"
          {...register("email", { required: true })}
          readOnly={!isEditing}
        />
        <input
          placeholder="Phone"
          {...register("phone", { required: true })}
          readOnly={!isEditing}
        />
        <input
          placeholder="Address"
          {...register("address", { required: true })}
          readOnly={!isEditing}
        />
        <label>Family Relation</label>
        <div className="preference">
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
        </div>
        {errors.relationId && <p>Please select a relation</p>}
        {isEditing && <button type="submit">Save Changes</button>}
      </form>
    </div>
  );
}

export default ContactPersonProfile;

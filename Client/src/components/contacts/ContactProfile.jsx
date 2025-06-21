import React, { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import { CodesContext } from '../Models';
import { CurrentUser } from '../App';
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
  console.log("currentUser:", currentUser);

  const onSubmit = async (formData) => {
    console.log("Submitting form...", formData);
    try {
      await updateProfile("", setIsEditing, formData);
      setIsEditing(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };


  const handleRequestEdit = async () => {
    try {
      alert("Verification email sent.");
      await sendEditRequest(setShowCodeInput);
      // setShowCodeInput(true);

    } catch (e) {
      alert("Failed to send email.");
    }
  };

  const verifyCode = async () => {
    try {
      await handleVerifyCode(code, setIsEditing, setShowCodeInput);
    } catch (e) {
      alert("Failed to send email.");
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

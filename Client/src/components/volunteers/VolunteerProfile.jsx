import React, { useState, useEffect, useContext } from 'react';
import { useForm } from "react-hook-form";
import { CodesContext } from '../Models';
import { CurrentUser } from '../App';
import '../../style/Profile.css'
import {
  useProfileData,
  useEditModeFromSessionStorage,
  updateProfile,
  handleVerifyCode,
  sendEditRequest
} from '../ProfileManagement';

function VolunteerProfile() {
  const [isEditing, setIsEditing] = useEditModeFromSessionStorage();
  const { codes, loading } = useContext(CodesContext);
  const { currentUser } = useContext(CurrentUser);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();
  const initialData = useProfileData("", reset);

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

  // return (
  //   <div>
  //     <h2>Volunteer Profile</h2>
  // {!isEditing && (
  //   <button onClick={handleRequestEdit}>update</button>
  // )}
  //     {!isEditing && showCodeInput && (
  //       <div>
  //         <input
  //           placeholder="Enter the verification code"
  //           value={code}
  //           onChange={(e) => setCode(e.target.value)}
  //         />
  //         <button onClick={verifyCode}>Verify code</button>
  //       </div>
  //     )}
  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <input
  //         placeholder="Full Name"
  //         {...register("fullName", { required: true })}
  //         readOnly={!isEditing}
  //       />
  //       {errors.fullName && <p>Required</p>}
  //       <input
  //         placeholder="Email"
  //         {...register("email", { required: true })}
  //         readOnly={!isEditing}
  //       />
  //       <input
  //         type="date"
  //         placeholder="Birth date"
  //         {...register("dateOfBirth", { required: true })}
  //         readOnly={!isEditing}
  //       />
  //       {errors.dateOfBirth && <p>Required</p>}
  //       <input
  //         placeholder="Phone"
  //         {...register("phone", { required: true })}
  //         readOnly={!isEditing}
  //       />
  //       {errors.phone && <p>Required</p>}
  //       <input
  //         placeholder="Address"
  //         {...register("address", { required: true })}
  //         readOnly={!isEditing}
  //       />
  //       {errors.address && <p>Required</p>}
  //       <select {...register("gender", { required: true })} disabled={!isEditing}>
  //         <option value="">Select a gender</option>
  //         {codes?.Genders?.map((item) => (
  //           <option key={item.id} value={item.id}>
  //             {item.description}
  //           </option>
  //         ))}
  //       </select>
  //       <select {...register("sector", { required: true })} disabled={!isEditing}>
  //         <option value="">Select a sector</option>
  //         {codes?.Sectors?.map((item) => (
  //           <option key={item.id} value={item.id}>
  //             {item.description}
  //           </option>
  //         ))}
  //       </select>
  //       <label>Volunteering Areas:</label>
  //       {codes?.VolunteeringTypes?.map((item) => (
  //         <div key={item.id}>
  //           <input
  //             type="checkbox"
  //             {...register("helpTypes")}
  //             value={item.id}
  //             id={`help-${item.id}`}
  //             disabled={!isEditing}
  //             defaultChecked={initialData?.VolunteerTypes?.some(vt => vt.volunteerTypeId === item.id)}
  //           />
  //           <label htmlFor={`help-${item.id}`}>{item.description}</label>
  //         </div>
  //       ))}
  //       <label>Departments:</label>
  //       {codes?.Departments?.map((item) => (
  //         <div key={item.id}>
  //           <input
  //             type="checkbox"
  //             {...register("preferredDepartments")}
  //             value={item.id}
  //             id={`dept-${item.id}`}
  //             disabled={!isEditing}
  //             defaultChecked={initialData?.VolunteersDepartments?.some(d => d.department === item.id)}
  //           />
  //           <label htmlFor={`dept-${item.id}`}>{item.description}</label>
  //         </div>
  //       ))}
  //       <label>Hospitals:</label>
  //       {codes?.Hospitals?.map((item) => (
  //         <div key={item.id}>
  //           <input
  //             type="checkbox"
  //             {...register("preferredHospitals")}
  //             value={item.id}
  //             id={`hospital-${item.id}`}
  //             disabled={!isEditing}
  //             defaultChecked={initialData?.VolunteersDepartments?.some(d => d.hospital === item.id)}
  //           />
  //           <label htmlFor={`hospital-${item.id}`}>{item.description}</label>
  //         </div>
  //       ))}
  //       <label>Guard Sectors:</label>
  //       {codes?.Sectors?.map((item) => (
  //         <div key={item.id}>
  //           <input
  //             type="checkbox"
  //             {...register("guardSectors")}
  //             value={item.id}
  //             id={`guard-sector-${item.id}`}
  //             disabled={!isEditing}
  //           />
  //           <label htmlFor={`guard-sector-${item.id}`}>{item.description}</label>
  //         </div>
  //       ))}
  //       <label>Guard Genders:</label>
  //       {codes?.Genders?.map((item) => (
  //         <div key={item.id}>
  //           <input
  //             type="checkbox"
  //             {...register("guardGenders")}
  //             value={item.id}
  //             id={`guard-gender-${item.id}`}
  //             disabled={!isEditing}
  //           />
  //           <label htmlFor={`guard-gender-${item.id}`}>{item.description}</label>
  //         </div>
  //       ))}
  //       <label>Flexibility in hours:</label>
  //       <div>
  //         <input
  //           type="radio"
  //           {...register("isFlexible")}
  //           value="true"
  //           id="flexible-yes"
  //           disabled={!isEditing}
  //           defaultChecked={initialData?.flexible === true || initialData?.flexible === "true"}
  //         />
  //         <label htmlFor="flexible-yes">yes</label>
  //         <input
  //           type="radio"
  //           {...register("isFlexible")}
  //           value="false"
  //           id="flexible-no"
  //           disabled={!isEditing}
  //           defaultChecked={initialData?.flexible === false || initialData?.flexible === "false"}
  //         />
  //         <label htmlFor="flexible-no">no</label>
  //       </div>
  //       {isEditing && <button onSubmit={onSubmit} type="submit">Update</button>}
  //     </form>
  //   </div>
  // );
  return (
    <div className="entryContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="entryForm">
        <h2>Volunteer Profile</h2>
        {!isEditing && (
          <button onClick={handleRequestEdit}>update</button>
        )}
        {!isEditing && showCodeInput && (
          <div>
            <input
              placeholder="Enter the verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="entryForm-input"
            />
            <button onClick={verifyCode}>Verify code</button>
          </div>
        )}

        <input
          placeholder="Full Name"
          {...register("fullName", { required: true })}
          readOnly={!isEditing}
        />
        {errors.fullName && <p>Required</p>}
        <input
          placeholder="Email"
          {...register("email", { required: true })}
          readOnly={!isEditing}
        />
        <input
          type="date"
          placeholder="Birth date"
          {...register("dateOfBirth", { required: true })}
          readOnly={!isEditing}
        />
        {errors.dateOfBirth && <p>Required</p>}
        <input
          placeholder="Phone"
          {...register("phone", { required: true })}
          readOnly={!isEditing}
        />
        {errors.phone && <p>Required</p>}
        <input
          placeholder="Address"
          {...register("address", { required: true })}
          readOnly={!isEditing}
        />
        {errors.address && <p>Required</p>}
        <select
          {...register("gender", { required: true })}
          disabled={!isEditing}
          className="entryForm-select"
        >
          <option value="">Select a gender</option>
          {codes?.Genders?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.description}
            </option>
          ))}
        </select>
        <select
          {...register("sector", { required: true })}
          disabled={!isEditing}
          className="entryForm-select"
        >
          <option value="">Select a sector</option>
          {codes?.Sectors?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.description}
            </option>
          ))}
        </select>
        <label>Volunteering Areas:</label>
        <div className="preference">
          {codes?.VolunteeringTypes?.map((item) => (
            <div key={item.id}>
              <input
                type="checkbox"
                {...register("helpTypes")}
                value={item.id}
                id={`help-${item.id}`}
                disabled={!isEditing}
                defaultChecked={initialData?.VolunteerTypes?.some(vt => vt.volunteerTypeId === item.id)}
              />
              <label htmlFor={`help-${item.id}`}>{item.description}</label>
            </div>
          ))}
        </div>
        <label>Departments:</label>
        <div className="preference">
          {codes?.Departments?.map((item) => (
            <div key={item.id}>
              <input
                type="checkbox"
                {...register("preferredDepartments")}
                value={item.id}
                id={`dept-${item.id}`}
                disabled={!isEditing}
                defaultChecked={initialData?.VolunteersDepartments?.some(d => d.department === item.id)}
              />
              <label htmlFor={`dept-${item.id}`}>{item.description}</label>
            </div>
          ))}
        </div>
        <label>Hospitals:</label>
        <div className="preference">
          {codes?.Hospitals?.map((item) => (
            <div key={item.id}>
              <input
                type="checkbox"
                {...register("preferredHospitals")}
                value={item.id}
                id={`hospital-${item.id}`}
                disabled={!isEditing}
                defaultChecked={initialData?.VolunteersDepartments?.some(d => d.hospital === item.id)}
              />
              <label htmlFor={`hospital-${item.id}`}>{item.description}</label>
            </div>
          ))}
        </div>
        <label>Guard Sectors:</label>
        <div className="preference">
          {codes?.Sectors?.map((item) => (
            <div key={item.id}>
              <input
                type="checkbox"
                {...register("guardSectors")}
                value={item.id}
                id={`guard-sector-${item.id}`}
                disabled={!isEditing}
              />
              <label htmlFor={`guard-sector-${item.id}`}>{item.description}</label>
            </div>
          ))}
        </div>
        <label>Guard Genders:</label>
        <div className="preference">
          {codes?.Genders?.map((item) => (
            <div key={item.id}>
              <input
                type="checkbox"
                {...register("guardGenders")}
                value={item.id}
                id={`guard-gender-${item.id}`}
                disabled={!isEditing}
              />
              <label htmlFor={`guard-gender-${item.id}`}>{item.description}</label>
            </div>
          ))}
        </div>
        <label>Flexibility in hours:</label>
        <div className="preference">
          <input
            type="radio"
            {...register("isFlexible")}
            value="true"
            id="flexible-yes"
            disabled={!isEditing}
            defaultChecked={initialData?.flexible === true || initialData?.flexible === "true"}
          />
          <label htmlFor="flexible-yes">yes</label>
          <input
            type="radio"
            {...register("isFlexible")}
            value="false"
            id="flexible-no"
            disabled={!isEditing}
            defaultChecked={initialData?.flexible === false || initialData?.flexible === "false"}
          />
          <label htmlFor="flexible-no">no</label>
        </div>
        {isEditing && <button onSubmit={onSubmit} type="submit">Update</button>}
      </form>
    </div>
  );
}

export default VolunteerProfile;

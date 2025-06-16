import React, { useState, useEffect, useContext } from 'react';
import { userService } from '../../services/usersServices';
import { CurrentUser } from '../App';
import { CodesContext } from '../Models';
import { useForm } from "react-hook-form";
import '../../style/VolunteerRequests.css';

function VolunteerProfile() {
  const { codes, loading } = useContext(CodesContext);
  const { currentUser } = useContext(CurrentUser);
  const [initialData, setInitialData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");


  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

  useEffect(() => {
    async function fetchProfile() {
      const data = await userService.getProfile(currentUser.id);
      setInitialData(data);
      console.log("data:", data);

      const formValues = {};

      for (const key in data) {
        if (Array.isArray(data[key])) {
          formValues[key] = data[key].map(item => {
            if (typeof item === 'object' && item !== null) {
              return item.volunteerTypeId ?? item.id ?? item;
            }
            return item;
          });
        } else if (typeof data[key] !== 'object') {
          formValues[key] = data[key];
        }
      }
      if (data.dateOfBirth) {
        formValues.dateOfBirth = data.dateOfBirth.split('T')[0];
      }
      if (data.user && typeof data.user === 'object') {
        for (const key in data.user) {
          if (!(key in formValues)) {
            formValues[key] = data.user[key];
          }
        }
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
      alert("הקוד אומת, ניתן לערוך את הפרופיל");
    } catch (err) {
      alert("קוד שגוי או שפג תוקפו");
    }
  };

  const onSubmit = async (formData) => {
    try {
      await userService.updateProfile(currentUser.id, formData);
      alert("Profile updated!");
      setIsEditing(false);
      setInitialData(formData);
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const handleRequestEdit = async () => {
    try {
      await userService.sendEditEmail(currentUser.id);
      alert("נשלח מייל עם קוד אימות");
      setShowCodeInput(true); // נפתח תיבת הזנה לקוד
    } catch (e) {
      console.error("שגיאה בשליחת אימייל:", e);
      alert("שליחת האימייל נכשלה");
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Volunteer Profile</h2>

      {!isEditing && (
        <button onClick={handleRequestEdit}>עריכה</button>
      )}
      {!isEditing && showCodeInput && (
        <div>
          <input
            placeholder="הכנס את קוד האימות מהאימייל"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleVerifyCode}>אמת קוד</button>
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

        <select {...register("gender", { required: true })} disabled={!isEditing}>
          <option value="">Select a gender</option>
          {codes?.Genders?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.description}
            </option>
          ))}
        </select>

        <select {...register("sector", { required: true })} disabled={!isEditing}>
          <option value="">Select a sector</option>
          {codes?.Sectors?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.description}
            </option>
          ))}
        </select>

        <label>Volunteering Areas:</label>
        {codes?.VolunteeringTypes?.map((item) => (
          <div key={item.id}>
            <input
              type="checkbox"
              {...register("helpTypes")}
              value={item.id}
              id={`help-${item.id}`}
              disabled={!isEditing}
              defaultChecked={initialData.VolunteerTypes?.some(vt => vt.volunteerTypeId === item.id)}
            />
            <label htmlFor={`help-${item.id}`}>{item.description}</label>
          </div>
        ))}

        <label>Departments:</label>
        {codes?.Departments?.map((item) => (
          <div key={item.id}>
            <input
              type="checkbox"
              {...register("preferredDepartments")}
              value={item.id}
              id={`dept-${item.id}`}
              disabled={!isEditing}
              defaultChecked={initialData.VolunteersDepartments?.some(d => d.department === item.id)}
            />
            <label htmlFor={`dept-${item.id}`}>{item.description}</label>
          </div>
        ))}

        <label>Hospitals:</label>
        {codes?.Hospitals?.map((item) => (
          <div key={item.id}>
            <input
              type="checkbox"
              {...register("preferredHospitals")}
              value={item.id}
              id={`hospital-${item.id}`}
              disabled={!isEditing}
              defaultChecked={initialData.VolunteersDepartments?.some(d => d.hospital === item.id)}
            />
            <label htmlFor={`hospital-${item.id}`}>{item.description}</label>
          </div>
        ))}

        <label>Guard Sectors:</label>
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

        <label>Guard Genders:</label>
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

        <label>Flexibility in hours:</label>
        <div>
          <input
            type="radio"
            {...register("isFlexible")}
            value="true"
            id="flexible-yes"
            disabled={!isEditing}
            defaultChecked={initialData.flexible === true || initialData.flexible === "true"}
          />
          <label htmlFor="flexible-yes">כן</label>

          <input
            type="radio"
            {...register("isFlexible")}
            value="false"
            id="flexible-no"
            disabled={!isEditing}
            defaultChecked={initialData.flexible === false || initialData.flexible === "false"}
          />
          <label htmlFor="flexible-no">לא</label>
        </div>

        {isEditing && <button type="submit">Update</button>}
      </form>
    </div>
  );
}

export default VolunteerProfile;

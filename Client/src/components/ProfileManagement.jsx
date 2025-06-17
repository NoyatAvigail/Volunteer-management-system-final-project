import { useEffect, useState, useContext } from 'react';
import { userService } from '../services/usersServices';
import { CurrentUser } from './App';

export const parseProfileDataToForm = (data) => {
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

  if (data?.dateOfBirth) {
    formValues.dateOfBirth = data.dateOfBirth.split('T')[0];
  }

  if (data?.user && typeof data?.user === 'object') {
    for (const key in data.user) {
      if (!(key in formValues)) {
        formValues[key] = data.user[key];
      }
    }
  }

  return formValues;
};

export function useProfileData(userId, userType, table, resetForm) {
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await userService.getAll(userId, userType, table);
      setInitialData(data);
      const formValues = parseProfileDataToForm(data);
      resetForm(formValues);
    }
    fetchData();
  }, [userId, userType, table, resetForm]);

  return initialData;
}

export function useEditModeFromSessionStorage() {
  const [isEditing, setIsEditing] = useState(() => {
    return sessionStorage.getItem('isEditing') === 'false';

  });

  useEffect(() => {
    sessionStorage.setItem('isEditing', isEditing);
  }, [isEditing]);

  return [isEditing, setIsEditing];
}

export async function sendEditRequest(userId, email) {
  return new Promise((resolve, reject) => {
    userService.create(userId, "send-edit-email", "", { email }, resolve, reject);
  });
}

export async function updateProfile(userId, userType, entityName, id, formData) {
  userService.update(
    userId,
    userType,        
    entityName,
    id,      
    formData,
    () => {
      setIsEditing(false);
    },
    (err) => {
      console.error("Update failed:", err);
      setIsEditing(false);
    }
  );
};


export const handleVerifyCode = async (code, setIsEditing, setShowCodeInput, currentUser) => {
  try {
    await userService.create(currentUser.id, "send-edit-email", "", { email: currentUser.email });
    setIsEditing(true);
    setShowCodeInput(false);
    alert("Verification successful. You may now edit the profile.");
  } catch (err) {
    console.error("Verification failed:", err);
    alert("Invalid or expired code.");
  }
};


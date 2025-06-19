import { useEffect, useState, useContext } from 'react';
// import { userService } from '../services/usersServices';
// import {volunteerService} from '../services/volunteersServices'
// import { CurrentUser } from './App';
// import profilesService from '../services/profilesService';
// export const parseProfileDataToForm = (data) => {
//   const formValues = {};

//   for (const key in data) {
//     const value = data[key];

//     if (Array.isArray(value)) {
//       formValues[key] = value.map(item => {
//         if (typeof item === 'object' && item !== null) {
//           return (
//             item.volunteerTypeId ??
//             item.genderId ??
//             item.sectorId ??
//             item.department ??
//             item.hospital ??
//             item.id ??
//             item
//           );
//         }
//         return item;
//       });
//     } else if (typeof value !== 'object' || value === null) {
//       formValues[key] = value;
//     }
//   }

//   if (data?.dateOfBirth) {
//     formValues.dateOfBirth = data.dateOfBirth.split('T')[0];
//   }

//   const userData = data.User || data.user;
//   if (userData && typeof userData === 'object') {
//     for (const key in userData) {
//       if (!(key in formValues)) {
//         formValues[key] = userData[key];
//       }
//     }
//   }

//   return formValues;
// };

// export function useProfileData(table, resetForm) {
//   const [initialData, setInitialData] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       const data = await profilesService.getAll();
//       setInitialData(data);
//       const formValues = parseProfileDataToForm(data);
//       resetForm(formValues);
//     }
//     fetchData();
//   }, [service, table, resetForm]);

//   return initialData;
// }

// export function useEditModeFromSessionStorage() {
//   const [isEditing, setIsEditing] = useState(() => {
//     return sessionStorage.getItem('isEditing') === 'false';

//   });

//   useEffect(() => {
//     sessionStorage.setItem('isEditing', isEditing);
//   }, [isEditing]);

//   return [isEditing, setIsEditing];
// }
// //לבדוק איפה באמת צריך להיות
export async function sendEditRequest() {
  return new Promise((resolve, reject) => {
    profilesService.create("send-edit-email", "", resolve, reject);
  });
}

export async function updateProfile(setIsEditing, formData) {
  profilesService.update(
    formData, 
    () => setIsEditing(false),
    (err) => {
      console.error("Update failed:", err);
      setIsEditing(false);
    }
  );
};


export const handleVerifyCode = async (code, setIsEditing, setShowCodeInput) => {
  try {
    await profilesService.create( "send-edit-email", "",);
    setIsEditing(true);
    setShowCodeInput(false);
    alert("Verification successful. You may now edit the profile.");
  } catch (err) {
    console.error("Verification failed:", err);
    alert("Invalid or expired code.");
  }
};

import {profilesService} from '../services/profilesService.js';

export const parseProfileDataToForm = (data) => {
  const formValues = {};

  for (const key in data) {
    const value = data[key];

    if (Array.isArray(value)) {
      formValues[key] = value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return (
            item.volunteerTypeId ??
            item.genderId ??
            item.sectorId ??
            item.department ??
            item.hospital ??
            item.id ??
            item
          );
        }
        return item;
      });
    } else if (typeof value !== 'object' || value === null) {
      formValues[key] = value;
    }
  }

  if (data?.dateOfBirth) {
    formValues.dateOfBirth = data.dateOfBirth.split('T')[0];
  }

  const userData = data.User || data.user;
  if (userData && typeof userData === 'object') {
    for (const key in userData) {
      if (!(key in formValues)) {
        formValues[key] = userData[key];
      }
    }
  }

  return formValues;
};

export function useProfileData(resetForm) {
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await profilesService.getAll();
      setInitialData(data);
      const formValues = parseProfileDataToForm(data);
      resetForm(formValues);
    }
    fetchData();
  }, [resetForm]);

  return initialData;
}
export function useEditModeFromSessionStorage() {
  const [isEditing, setIsEditing] = useState(() =>
    sessionStorage.getItem('isEditing') === 'true'
  );

  useEffect(() => {
    sessionStorage.setItem('isEditing', isEditing);
  }, [isEditing]);

  return [isEditing, setIsEditing];
}
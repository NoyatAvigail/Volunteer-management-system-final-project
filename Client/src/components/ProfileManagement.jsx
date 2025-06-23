// import { useEffect, useState, useContext } from 'react';
// import { handleVerifyCodes, sendEditRequests } from '../services/profilesService'
// import { profilesServices } from '../services/profilesService'
// import { patientsService } from '../services/patientsService';

// export function useProfileData(type = "", resetForm) {
//   const [initialData, setInitialData] = useState(null);
//   useEffect(() => {
//     async function fetchData() {
//       let data;
//       if (type === "patients") {
//         data = await patientsService.getAll();
//       } else {
//         data = await profilesServices.getAll();
//       }

//       setInitialData(data);
//       const formValues = parseProfileDataToForm(data);
//       resetForm(formValues);
//     }
//     fetchData();
//   }, [resetForm, type]);

//   return initialData;
// }

// export async function updateProfile(type = "", setIsEditing, formData) {
//   let service = profilesServices;
//   let id = formData.id || formData.userId;

//   if (type === "patients") {
//     service = patientsService;
//   }

//   service.update(
//     id,
//     formData,
//     () => setIsEditing(false),
//     (err) => {
//       console.error("Update failed:", err);
//       setIsEditing(false);
//     }
//   );
// }

// export async function sendEditRequest(setShowCodeInput) {
//   return new Promise(() => {
//     sendEditRequests();
//     setShowCodeInput(true);
//   });
// }

// export const handleVerifyCode = async (code, setIsEditing, setShowCodeInput) => {
//   try {
//     const success = await handleVerifyCodes(code, setIsEditing, setShowCodeInput);
//     if (success) {
//       setIsEditing(true);
//       alert("Verification successful. You may now edit the profile.");
//       setShowCodeInput(false);
//     } else {
//       alert("Invalid or expired code.");
//     }
//   } catch (err) {
//     console.error("Verification failed:", err);
//     alert("Invalid or expired code.");
//   }
// };

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
//   const userData = data?.User || data?.user;
//   if (userData && typeof userData === 'object') {
//     for (const key in userData) {
//       if (!(key in formValues)) {
//         formValues[key] = userData[key];
//       }
//     }
//   }

//   return formValues;
// };

// export function useEditModeFromSessionStorage() {
//   const [isEditing, setIsEditing] = useState(() =>
//     sessionStorage.getItem('isEditing') === 'true'
//   );

//   useEffect(() => {
//     sessionStorage.setItem('isEditing', isEditing);
//   }, [isEditing]);
//   return [isEditing, setIsEditing];
// }
// ProfileManagement.js
import { useEffect, useState } from 'react';
import { handleVerifyCodes, sendEditRequests } from '../services/profilesService';
import { profilesServices } from '../services/profilesService';
import { patientsService } from '../services/patientsServices';

export function useProfileData(type = "", resetForm) {
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let data;
      if (type === "patients") {
        data = await patientsService.getAll();
      } else {
        data = await profilesServices.getAll();
      }

      setInitialData(data);
      const formValues = parseProfileDataToForm(data);
      resetForm(formValues);
    }
    fetchData();
  }, [resetForm, type]);

  return initialData;
}

export async function updateProfile(type = "", setIsEditing, formData) {
  let service = profilesServices;
  let url = '';
  if (type === "patients") {
    service = patientsService;
    url = formData.id || formData.userId;
  }
  service.update(
    url,
    formData,
    () => setIsEditing(false),
    (err) => {
      console.error("Update failed:", err);
      setIsEditing(false);
    }
  );
}

export async function sendEditRequest(setShowCodeInput) {
  try {
    await sendEditRequests();
    setShowCodeInput(true);
  } catch (err) {
    console.error("Failed to send edit request:", err);
  }
}

export const handleVerifyCode = async (code, setIsEditing, setShowCodeInput) => {
  try {
    const success = await handleVerifyCodes(code, setIsEditing, setShowCodeInput);
    if (success) {
      setIsEditing(true);
      alert("Verification successful. You may now edit the profile.");
      setShowCodeInput(false);
    } else {
      alert("Invalid or expired code.");
    }
  } catch (err) {
    console.error("Verification failed:", err);
    alert("Invalid or expired code.");
  }
};

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
  const userData = data?.User || data?.user;
  if (userData && typeof userData === 'object') {
    for (const key in userData) {
      if (!(key in formValues)) {
        formValues[key] = userData[key];
      }
    }
  }

  return formValues;
};

export function useEditModeFromSessionStorage() {
  const [isEditing, setIsEditing] = useState(() =>
    sessionStorage.getItem('isEditing') === 'true'
  );

  useEffect(() => {
    sessionStorage.setItem('isEditing', isEditing);
  }, [isEditing]);

  return [isEditing, setIsEditing];
}

import React, { useContext } from 'react';
import { CurrentUser } from '.././App';
import Add from '.././Add';

function ContactNewRequest() {
  const { currentUser } = useContext(CurrentUser);

  if (!currentUser || currentUser.type !== 'contact') {
    return <div>אין גישה לטופס זה</div>;
  }

  return (
    <div className="form-container">
      <h2>הוספת פנייה חדשה</h2>
      <Add
        type="Events"
        setIsChange={() => { }} 
        inputs={[
          "patientId",
          "contactId",
          "hospital",
          "department",
          "roomNumber",
          "date",
          "startTime",
          "endTime"
        ]}
        defaultValue={{
          patientId: "",
          contactId: currentUser.id,
          hospital: "",
          department: "",
          roomNumber: "",
          date: "",
          startTime: "",
          endTime: ""
        }}
        name="הוסף פנייה"
      />
    </div>
  );
}

export default ContactNewRequest;
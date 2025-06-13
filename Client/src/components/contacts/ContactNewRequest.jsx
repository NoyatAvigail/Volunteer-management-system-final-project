import React, { useContext } from 'react';
import { CurrentUser } from '.././App';
import { CodesContext } from '.././Models';
import Add from '.././Add';

function ContactNewRequest() {
  const { currentUser } = useContext(CurrentUser);
  const { codes, loading } = useContext(CodesContext);
  const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
  const hospitalsObj = codes?.Hospitals;
  const departmentsObj = codes?.Departments;

  if (!currentUser || userTypeObj !== 'ContactPerson') {
    return <div>No access to this form</div>;
  }

  return (
    <div className="form-container">
      <h2>Add new request</h2>
      <Add
        type="Events"
        setIsChange={() => { }}
        inputs={[
          "patientId",
          "contactId",
          {
            name: "hospital",
            type: "select",
            options: hospitalsObj.map(h => ({ label: h.description, value: h.id }))
          },
          {
            name: "department",
            type: "select",
            options: departmentsObj.map(h => ({ label: h.description, value: h.id }))
          },
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
        name="Add request"
      />
    </div>
  );
}

export default ContactNewRequest;
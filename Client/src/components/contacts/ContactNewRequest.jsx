import React, { useContext, useEffect, useRef, useState } from 'react';
import { CurrentUser } from '.././App';
import { CodesContext } from '.././Models';
import Add from '.././Add';
import { userService } from '../../services/usersServices'

function ContactNewRequest() {
  const { currentUser } = useContext(CurrentUser);
  const { codes, loading } = useContext(CodesContext);
  const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
  const [hospitalizeds, setHospitalizeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current && currentUser?.autoId && userTypeObj) {
      didFetch.current = true;
      userService.getByValue(
        currentUser.autoId,
        userTypeObj,
        "Patients",
        { contactPeopleId: currentUser.id },
        (res) => setPatients(res || []),
        (err) => console.error("Failed to fetch patients:", err)
      );
    }
  }, [currentUser?.autoId, userTypeObj]);

  useEffect(() => {
    if (selectedPatientId) {
      userService.getByValue(
        currentUser.autoId,
        userTypeObj,
        "Hospitalizeds",
        { patientId: selectedPatientId },
        (res) => setHospitalizeds(res || []),
        (err) => console.error("Failed to fetch hospitalizeds:", err)
      );
    }
  }, [selectedPatientId]);

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
          {
            name: "patientId",
            type: "select",
            options: patients.map(h => ({ label: h.userId, value: h.userId })),
            onChange: (e) => setSelectedPatientId(e.target.value)
          },
          "contactId",
          {
            name: "hospitalizedsId",
            type: "select",
            options: hospitalizeds.map(h => ({
              label: `בית חולים: ${h.hospital}, מחלקה: ${h.department}, חדר: ${h.roomNumber}, מתחילת אשפוז: ${h.hospitalizationStart}`,
              value: h.id
            }))
          },
          "date",
          "startTime",
          "endTime"
        ]}
        defaultValue={{
          patientId: "",
          contactId: currentUser.id,
          hospitalizedsId: "",
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
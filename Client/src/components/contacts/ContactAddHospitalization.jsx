import React, { useState, useContext, useEffect, useRef } from 'react';
import { CurrentUser } from '.././App';
import { CodesContext } from '.././Models';
import { userService } from '../../services/usersServices'
import Add from '.././Add';

function ContactAddHospitalization() {
    const { currentUser } = useContext(CurrentUser);
    const { codes, loading } = useContext(CodesContext);
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    const hospitalsObj = codes?.Hospitals;
    const departmentsObj = codes?.Departments;
    const [patients, setPatients] = useState([]);

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

    if (!currentUser || userTypeObj !== 'ContactPerson') {
        return <div>No access to this form</div>;
    }

    return (
        <div>
            <div className="form-container">
                <h2>Add new hospitalizeds</h2>
                <Add
                    type="Hospitalizeds"
                    setIsChange={() => { }}
                    inputs={[
                        {
                            name: "patientId",
                            type: "select",
                            options: patients.map(h => ({ label: h.userId, value: h.userId }))
                        },
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
                        "hospitalizationStart",
                        "hospitalizationEnd"
                    ]}
                    defaultValue={{
                        patientId: "",
                        hospital: "",
                        department: "",
                        roomNumber: "",
                        hospitalizationStart: "",
                        hospitalizationEnd: null
                    }}
                    name="Add Hospitalizeds"
                />
            </div>
        </div>
    );
}

export default ContactAddHospitalization;
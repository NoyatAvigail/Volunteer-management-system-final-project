import React, { useState, useContext } from 'react';
import { CurrentUser } from '.././App';
import { CodesContext } from '.././Models';
import Add from '.././Add';

function ContactAddPatient() {
    const { currentUser } = useContext(CurrentUser);
    const { codes, loading } = useContext(CodesContext);
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    const sectorsObj = codes?.Hospitals;
    const gendersObj = codes?.Departments;

    if (!currentUser || userTypeObj !== 'ContactPerson') {
        return <div>No access to this form</div>;
    }

    return (
        <div>
            <div className="form-container">
                <h2>Add new patient</h2>
                <Add
                    type="Patients"
                    setIsChange={() => { }}
                    inputs={[
                        "id",
                        "contactId",
                        "fullName",
                        "dateOfBirth",
                        {
                            name: "sector",
                            type: "select",
                            options: sectorsObj.map(h => ({ label: h.description, value: h.id }))
                        },
                        {
                            name: "gender",
                            type: "select",
                            options: gendersObj.map(h => ({ label: h.description, value: h.id }))
                        },
                        "address"
                    ]}
                    defaultValue={{
                        id: "",
                        contactId: currentUser.id,
                        fullName: "",
                        dateOfBirth: "",
                        sector: "",
                        gender: "",
                        address: "",
                    }}
                    name="Add patient"
                />
            </div>
        </div>
    );
}

export default ContactAddPatient;
import React, { useState, useContext } from 'react';
import { CurrentUser } from '.././App';
import { CodesContext } from '.././Models';
import Add from '.././Add';

function ContactAddPatient() {
    const { currentUser } = useContext(CurrentUser);
    const { codes, loading } = useContext(CodesContext);
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    const sectorsObj = codes?.Sectors;
    const gendersObj = codes?.Genders;
    console.log("currentUser:", currentUser);

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
                        {
                            name: "userId",
                            label: "Patient ID",
                            type: "text"
                        },
                        "contactPeopleId",
                        "fullName",
                        {
                            name: "dateOfBirth",
                            type: "date"
                        },
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
                        "address",
                        {
                            name: "patientInterestedInReceivingNotifications",
                            type: "checkbox",
                            label: "Interested in receiving notifications?"
                        }]}
                    defaultValue={{
                        userId: "",
                        contactPeopleId: currentUser.id,
                        fullName: "",
                        dateOfBirth: "",
                        sector: "",
                        gender: "",
                        address: "",
                        patientInterestedInReceivingNotifications: "",
                    }}
                    name="Add patient"
                />
            </div>
        </div>
    );
}

export default ContactAddPatient;
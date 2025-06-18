import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCodes } from ".././Models";
import { CurrentUser } from '.././App';
import Add from '.././Add';
import Search from '.././Search';
import Sort from '.././Sort';
import Delete from '.././Delete';
import Update from '.././Update';
import '../../style/Posts.css';
import { requestService } from '../../services/requestsServices';
import { userService } from '../../services/usersServices';

function ContactRequests() {
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);
    const { codes } = useCodes();
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [hospitalizedsPerPatient, setHospitalizedsPerPatient] = useState([]);
    const didFetch = useRef(false);

    const noAccess = !currentUser || userTypeObj !== 'ContactPerson';

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
                (res) => setHospitalizedsPerPatient(res || []),
                (err) => console.error("Failed to fetch hospitalizeds:", err)
            );
        }
    }, [selectedPatientId]);
    
    useEffect(() => {
        if (!currentUser || !currentUser.id) {
            setError("User not logged in");
            return;
        }
        const fetchData = async () => {
            try {
                const startDate = '2025-08-01';
                const endDate = '2025-08-31';
                await requestService.getRequestsByContactAndDate(
                    currentUser.id,
                    startDate,
                    endDate,
                    (result) => {
                        console.log("get successful:", result);
                        setUserData(result);
                        setEvents(result);
                        setIsChange(1);
                    },
                    (error) => {
                        console.log("get was unsuccessful", error);
                        setError("Error loading data");
                    }
                );
            } catch (error) {
                console.log("Unexpected error:", error);
                setError("Unexpected error loading data");
            }
        };
        fetchData();
    }, [currentUser]);

    if (!currentUser || userTypeObj !== 'ContactPerson') {
        return <div>No access to this form</div>;
    }

    function parseDateFromDDMMYYYY(dateStr) {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    const isPastEvent = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventDate = new Date(dateStr);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate < today;
    };

    return (
        <>
            <div className='control'>
                <Sort
                    type="requests"
                    setIsChange={setIsChange}
                    options={["date", "hospital", "department", "patientId"]}
                    userData={userData}
                    setData={setEvents}
                />
                <Search
                    type="requests"
                    setIsChange={setIsChange}
                    options={["All", "hospital", "department", "patientId"]}
                    data={userData}
                    setData={setEvents}
                />
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
                            options: hospitalizedsPerPatient.map(h => ({
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
            </div >
            {error && <div className="error">{error}</div>
            }
            <div className="requests">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Patient name</th>
                            <th>Patient id</th>
                            <th>Hospital</th>
                            <th>Department</th>
                            <th>Room number</th>
                            <th>Date</th>
                            <th>Start time</th>
                            <th>End time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events && events.length > 0 ? (
                            events.map((item) => {
                                const isPast = isPastEvent(item.date);
                                return (
                                    <tr key={item.id} style={{ backgroundColor: isPastEvent(item.date) ? '#eee' : 'white' }}>
                                        <td>{item.Hospitalized.Patient?.fullName}</td>
                                        <td>{item.Hospitalized.patientId}</td>
                                        <td>{item.Hospitalized.Hospital?.description}</td>
                                        <td>{item.Hospitalized.Department?.description}</td>
                                        <td>{item.Hospitalized.roomNumber}</td>
                                        <td>{new Date(item.date).toISOString().split('T')[0]}</td>
                                        <td>{item.startTime}</td>
                                        <td>{item.endTime}</td>
                                        <td>
                                            {item.contactId === currentUser.id && (
                                                <>
                                                    <Update
                                                        type="Events"
                                                        itemId={item.id}
                                                        setIsChange={setIsChange}
                                                        inputs={["patientId", "hospital", "department", "roomNumber", "date", "startTime", "endTime"]}
                                                        defaultValue={item}
                                                        disabled={isPast}
                                                    />
                                                    <Delete
                                                        type="Events"
                                                        itemId={item.id}
                                                        setIsChange={setIsChange}
                                                        disabled={isPast}
                                                    />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8}>אין נתונים להצגה</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ContactRequests;
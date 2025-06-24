// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCodes } from ".././Models";
// import { CurrentUser } from '.././App';
// import Add from '.././Add';
// import Search from '.././Search';
// import Sort from '.././Sort';
// import Delete from '.././Delete';
// import Update from '.././Update';
// import '../../style/Requests.css';
// import { requestsServices } from '../../services/requestsServices';
// import { hospitalizedsService } from '../../services/hospitalizedsServices'
// import { patientsService } from '../../services/patientsServices'

// function ContactRequests() {
//     const [userData, setUserData] = useState([]);
//     const [error, setError] = useState(null);
//     const [isChange, setIsChange] = useState(false);
//     const { currentUser } = useContext(CurrentUser);
//     const { codes } = useCodes();
//     const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
//     const navigate = useNavigate();
//     const [events, setEvents] = useState([]);
//     const [patients, setPatients] = useState([]);
//     const [selectedPatientId, setSelectedPatientId] = useState("");
//     const [hospitalizedsPerPatient, setHospitalizedsPerPatient] = useState([]);
//     const [updateRow, setUpdateRow] = useState(null);
//     const didFetch = useRef(false);

//     const noAccess = !currentUser || userTypeObj !== 'ContactPerson';
//     useEffect(() => {
//         if (!currentUser || !currentUser.id) {
//             setError("User not logged in");
//             return;
//         }
//         fetchData();
//     }, [isChange, currentUser]);

//     useEffect(() => {
//         if (!didFetch.current && currentUser?.autoId && userTypeObj) {
//             didFetch.current = true;
//             patientsService.getAll(
//                 (res) => setPatients(res || []),
//                 (err) => console.error("Failed to fetch patients:", err)
//             );

//         }
//     }, [currentUser?.autoId, userTypeObj]);

//     useEffect(() => {
//         if (selectedPatientId) {
//             fetchHospitalizeds(selectedPatientId);
//         }
//     }, [selectedPatientId]);

//     useEffect(() => {
//         if (updateRow && updateRow.patientId) {
//             fetchHospitalizeds(updateRow.patientId);
//             console.log("hospitalizedsPerPatient:", hospitalizedsPerPatient);

//         }
//     }, [updateRow]);
//     const fetchHospitalizeds = (patientId) => {
//         hospitalizedsService.getByValue(
//             patientId,
//             (res) => setHospitalizedsPerPatient(res || []),
//             (err) => console.error("Failed to fetch hospitalizeds:", err)
//         );

//     };

//     const fetchData = async () => {
//         try {
//             const startDate = '2000-06-01';
//             const endDate = '2029-08-31';
//             await requestsServices.getAll(
//                 startDate,
//                 endDate,
//                 (result) => {
//                     console.log("get successful:", result);
//                     setUserData(result);
//                     setEvents(result);
//                     setIsChange(prev => !prev);
//                 },
//                 (error) => {
//                     console.log("get was unsuccessful", error);
//                     setError("Error loading data");
//                 }
//             );
//         } catch (error) {
//             console.log("Unexpected error:", error);
//             setError("Unexpected error loading data");
//         }
//     };


//     const triggerRefresh = () => setIsChange(prev => !prev);

//     if (!currentUser || userTypeObj !== 'ContactPerson') {
//         return <div>No access to this form</div>;
//     }

//     const isPastEvent = (dateStr) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const eventDate = new Date(dateStr);
//         eventDate.setHours(0, 0, 0, 0);
//         return eventDate < today;
//     };

//     return (
//         <>
//             <div className='control'>
//                 <Sort
//                     type="requests"
//                     setIsChange={triggerRefresh}
//                     options={["date", "hospital", "department", "patientId"]}
//                     userData={userData}
//                     setData={setEvents}
//                 />
//                 <Search
//                     type="requests"
//                     setIsChange={triggerRefresh}
//                     options={["All", "hospital", "department", "patientId"]}
//                     data={userData}
//                     setData={setEvents}
//                 />
//                 <Add
//                     type="Events"
//                     onSuccess={(newItem) => {
//                         setUserData(prev => [...prev, newItem]);
//                         setEvents(prev => [...prev, newItem]);
//                     }}
//                     inputs={[
//                         {
//                             name: "patientId",
//                             type: "select",
//                             options: patients.map(h => ({ label: h.userId, value: h.userId })),
//                             onChange: (e) => setSelectedPatientId(e.target.value)
//                         },
//                         "contactId",
//                         {
//                             name: "hospitalizedsId",
//                             type: "select",
//                             options: hospitalizedsPerPatient.map(h => ({
//                                 label: `Hospital: ${h.Hospital.description}, Department: ${h.Department.description}, Room: ${h.roomNumber}`, value: h.id
//                             }))
//                         },
//                         "date",
//                         "startTime",
//                         "endTime"
//                     ]}
//                     defaultValue={{
//                         patientId: "",
//                         contactId: currentUser.id,
//                         hospitalizedsId: "",
//                         date: "",
//                         startTime: "",
//                         endTime: ""
//                     }}
//                     name="Add request"
//                 />
//             </div>
//             {error && <div className="error">{error}</div>}
//             <div className="requests">
//                 <h2>My Requests</h2>
//                 <table className="requests-table">
//                     <thead>
//                         <tr>
//                             <th>Patient name</th>
//                             <th>Patient id</th>
//                             <th>Hospital</th>
//                             <th>Department</th>
//                             <th>Room number</th>
//                             <th>Date</th>
//                             <th>Start time</th>
//                             <th>End time</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {events && events.length > 0 ? (
//                             events.map((item) => {
//                                 const isPast = isPastEvent(item.date);
//                                 return (
//                                     <tr key={item.id} style={{ backgroundColor: isPast ? '#eee' : 'white' }}>
//                                         <td>{item.Hospitalized.Patient?.fullName}</td>
//                                         <td>{item.Hospitalized.patientId}</td>
//                                         <td>{item.Hospitalized.Hospital?.description}</td>
//                                         <td>{item.Hospitalized.Department?.description}</td>
//                                         <td>{item.Hospitalized.roomNumber}</td>
//                                         <td>{new Date(item.date).toISOString().split('T')[0]}</td>
//                                         <td>{item.startTime}</td>
//                                         <td>{item.endTime}</td>
//                                         <td>
//                                             {item.contactId === currentUser.id && (
//                                                 <>
//                                                     <Update
//                                                         type="Events"
//                                                         itemId={item.id}
//                                                         onSuccess={(updatedItem) => {
//                                                             setUserData(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
//                                                             setEvents(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
//                                                         }}
//                                                         inputs={[
//                                                             {
//                                                                 name: "patientId",
//                                                                 type: "select",
//                                                                 options: patients.map(h => ({ label: h.userId, value: h.userId })),
//                                                                 onChange: (e) => {
//                                                                     const patientId = e.target.value;
//                                                                     setUpdateRow({ ...item, patientId });
//                                                                 }
//                                                             },
//                                                             {
//                                                                 name: "hospitalizedsId",
//                                                                 type: "select",
//                                                                 options: hospitalizedsPerPatient.map(h => ({
//                                                                     label: `Hospital: ${h.Hospital.description}, Department: ${h.Department.description}, Room: ${h.roomNumber}`, value: h.id
//                                                                 }))
//                                                             },
//                                                             "date",
//                                                             "startTime",
//                                                             "endTime"
//                                                         ]}
//                                                         defaultValue={{
//                                                             patientId: item.Hospitalized.patientId,
//                                                             contactId: item.contactId,
//                                                             hospitalizedsId: item.hospitalizedsId,
//                                                             date: item.date,
//                                                             startTime: item.startTime,
//                                                             endTime: item.endTime
//                                                         }}
//                                                     />
//                                                     <Delete
//                                                         type="Events"
//                                                         itemId={item.id}
//                                                         setIsChange={triggerRefresh}
//                                                         disabled={isPast}
//                                                     />
//                                                 </>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan={8}>No data to display</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// }

// export default ContactRequests;
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCodes } from ".././Models";
import { CurrentUser } from '.././App';
import Add from '.././Add';
import Search from '.././Search';
import Sort from '.././Sort';
import Delete from '.././Delete';
import Update from '.././Update';
import '../../style/Requests.css';
import { requestsServices } from '../../services/requestsServices';
import { hospitalizedsService } from '../../services/hospitalizedsServices'
import { patientsService } from '../../services/patientsServices'

function ContactRequests() {
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(false);
    const { currentUser } = useContext(CurrentUser);
    const { codes } = useCodes();
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [hospitalizedsPerPatient, setHospitalizedsPerPatient] = useState([]);
    const [updateRow, setUpdateRow] = useState(null);
    const [startDate, setStartDate] = useState('01/01/2020');
    const [endDate, setEndDate] = useState('01/07/2027');
    const didFetch = useRef(false);

    const noAccess = !currentUser || userTypeObj !== 'ContactPerson';

    useEffect(() => {
        if (!currentUser || !currentUser.id) {
            setError("User not logged in");
            return;
        }
        fetchData();
    }, [isChange, currentUser]);

    useEffect(() => {
        if (!didFetch.current && currentUser?.autoId && userTypeObj) {
            didFetch.current = true;
            patientsService.getAll(
                (res) => setPatients(res || []),
                (err) => console.error("Failed to fetch patients:", err)
            );
        }
    }, [currentUser?.autoId, userTypeObj]);

    useEffect(() => {
        if (selectedPatientId) {
            fetchHospitalizeds(selectedPatientId);
        }
    }, [selectedPatientId]);

    useEffect(() => {
        if (updateRow && updateRow.patientId) {
            fetchHospitalizeds(updateRow.patientId);
        }
    }, [updateRow]);

    const fetchHospitalizeds = (patientId) => {
        hospitalizedsService.getByValue(
            patientId,
            (res) => setHospitalizedsPerPatient(res || []),
            (err) => console.error("Failed to fetch hospitalizeds:", err)
        );
    };
    const fetchData = async () => {
        if (!startDate || !endDate) {
            setError("Please select start and end dates");
            return;
        }

        try {
            await requestsServices.getAll(
                startDate,
                endDate,
                (result) => {
                    setUserData(result);
                    setEvents(result);
                    setIsChange(prev => !prev);
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

    const triggerRefresh = () => setIsChange(prev => !prev);

    const isPastEvent = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(dateStr);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
    };

    if (!currentUser || userTypeObj !== 'ContactPerson') {
        return <div>No access to this form</div>;
    }

    return (
        <>
            <div className='control'>
                <div className="date-filter">
                    <label>
                        From date:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <label>
                        To date:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                    <button onClick={fetchData}>Show Events</button>
                </div>

                <Sort
                    type="requests"
                    userData={userData}
                    setData={setEvents}
                />
                <Search
                    setIsChange={triggerRefresh}
                    options={["All", "hospital", "department", "patientId"]}
                    data={userData}
                    setData={setEvents}
                />
                <Add
                    type="Events"
                    onSuccess={(newItem) => {
                        setUserData(prev => [...prev, newItem]);
                        setEvents(prev => [...prev, newItem]);
                    }}
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
                                label: `Hospital: ${h.Hospital.description}, Department: ${h.Department.description}, Room: ${h.roomNumber}`,
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

            {error && <div className="error">{error}</div>}

            <div className="requests">
                <h2>My Requests</h2>
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
                                const isPast = isPastEvent(item?.date);
                                return (
                                    <tr key={item?.id} style={{ backgroundColor: isPast ? '#ddd' : 'white', color: isPast ? '#777' : 'black' }}>
                                        <td>{item?.Hospitalized.Patient?.fullName}</td>
                                        <td>{item?.Hospitalized.patientId}</td>
                                        <td>{item?.Hospitalized.Hospital?.description}</td>
                                        <td>{item?.Hospitalized.Department?.description}</td>
                                        <td>{item?.Hospitalized.roomNumber}</td>
                                        <td>{new Date(item.date).toISOString().split('T')[0]}</td>
                                        <td>{item?.startTime}</td>
                                        <td>{item?.endTime}</td>
                                        <td>
                                            {item.contactId === currentUser.id && !isPast && (
                                                <>
                                                    <Update
                                                        type="Events"
                                                        itemId={item.id}
                                                        onSuccess={(updatedItem) => {
                                                            setUserData(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
                                                            setEvents(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
                                                        }}
                                                        inputs={[
                                                            {
                                                                name: "patientId",
                                                                type: "select",
                                                                options: patients.map(h => ({ label: h.userId, value: h.userId })),
                                                                onChange: (e) => {
                                                                    const patientId = e.target.value;
                                                                    setUpdateRow({ ...item, patientId });
                                                                }
                                                            },
                                                            {
                                                                name: "hospitalizedsId",
                                                                type: "select",
                                                                options: hospitalizedsPerPatient.map(h => ({
                                                                    label: `Hospital: ${h.Hospital.description}, Department: ${h.Department.description}, Room: ${h.roomNumber}`,
                                                                    value: h.id
                                                                }))
                                                            },
                                                            "date",
                                                            "startTime",
                                                            "endTime"
                                                        ]}
                                                        defaultValue={{
                                                            patientId: item.Hospitalized.patientId,
                                                            contactId: item.contactId,
                                                            hospitalizedsId: item.hospitalizedsId,
                                                            date: item.date,
                                                            startTime: item.startTime,
                                                            endTime: item.endTime
                                                        }}
                                                    />
                                                    <Delete
                                                        type="Events"
                                                        itemId={item.id}
                                                        setIsChange={triggerRefresh}
                                                    />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={9}>No data to display</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ContactRequests;

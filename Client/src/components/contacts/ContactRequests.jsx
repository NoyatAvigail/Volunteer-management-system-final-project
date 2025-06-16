import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodesContext } from '.././Models';
import { CurrentUser } from '.././App';
import Add from '.././Add';
import Search from '.././Search';
import Sort from '.././Sort';
import Delete from '.././Delete';
import Update from '.././Update';
import '../../style/Posts.css';
import { userService } from '../../services/usersServices';
import { logOutFunc } from '../../js/logout';

function ContactRequests() {
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);
    const { codes } = useContext(CodesContext);
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    const navigate = useNavigate();
    const [hospitalizeds, setHospitalizeds] = useState([]);
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
        setError(null);
        if (!currentUser || !currentUser.id) {
            setError("User not logged in");
            return;
        }
        const fetchData = async () => {
            try {
                await userService.getByValue(
                    currentUser.autoId,
                    "contact",
                    "Events",
                    { contactId: currentUser.id },
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

    useEffect(() => {
        if (!isChange || !events.length) return;
        const fetchData = async () => {
            setError(null);
            try {
                await userService.getByForeignJoin(
                    currentUser.autoId,
                    userTypeObj,
                    "Events",
                    "hospitalizedsId",
                    "Hospitalizeds",
                    "id",
                    "contactId",
                    currentUser.id,
                    (result) => {
                        console.log("get successful:", result);
                        const arrayResult = Array.isArray(result) ? result : [result];
                        setUserData(arrayResult);
                        setEvents(arrayResult);
                        const map = {};
                        arrayResult.forEach(h => {
                            if (!map[h.patientId]) map[h.patientId] = [];
                            map[h.patientId].push(h);
                        });
                        setHospitalizeds(map);
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
    }, [isChange]);

    if (!currentUser || userTypeObj !== 'ContactPerson') {
        return <div>No access to this form</div>;
    }

    const isPastEvent = (date) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const eventDate = new Date(date).setHours(0, 0, 0, 0);
        return eventDate < today;
    };

    const handleShowDetails = (id) => {
        navigate(`/${currentUser.type}/${currentUser.id}/request-details/${id}`);
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
            <table className="requests-table">
                <tbody>
                    {events && events.length > 0 ? (
                        events.map((item) => {
                            const isPast = isPastEvent(item.date);
                            const hospitalizations = hospitalizeds[item.patientId] || [];
                            return (
                                <tr key={item.id} style={{ backgroundColor: isPast ? '#eee' : 'white' }}>
                                    <td>{item.date}</td>
                                    <td>{item.startTime}</td>
                                    <td>{item.endTime}</td>
                                    <td>{item.roomNumber}</td>
                                    <td>{item.hospital}</td>
                                    <td>{item.department}</td>
                                    <td>{item.patientId}</td>
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
                                        {hospitalizations.length > 0 && (
                                            <table className="inner-table">
                                                <thead>
                                                    <tr>
                                                        <th>בית חולים</th>
                                                        <th>מחלקה</th>
                                                        <th>חדר</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {hospitalizations.map((h, idx) => (
                                                        <tr key={h.id || idx}>
                                                            <td>{h.hospital}</td>
                                                            <td>{h.department}</td>
                                                            <td>{h.roomNumber}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={8}>No data to display</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default ContactRequests;



// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CodesContext } from '.././Models';
// import { CurrentUser } from '.././App';
// import Search from '.././Search';
// import Sort from '.././Sort';
// import Delete from '.././Delete';
// import Update from '.././Update';
// import '../../style/Posts.css';
// import { userService } from '../../services/usersServices';
// import { logOutFunc } from '../../js/logout';

// function ContactRequests() {
//     const [userData, setUserData] = useState([]);
//     const [error, setError] = useState(null);
//     const [isChange, setIsChange] = useState(0);
//     const { currentUser } = useContext(CurrentUser);
//     const { codes, loading } = useContext(CodesContext);
//     const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
//     const navigate = useNavigate();
//     const [hospitalizeds, setHospitalizeds] = useState([]);
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         setError(null);
//         if (!currentUser || !currentUser.id) {
//             setError("User not logged in");
//             return;
//         }
//         const fetchData = async () => {
//             try {
//                 await userService.getByValue(
//                     currentUser.autoId,
//                     "contact",
//                     "Events",
//                     { contactId: currentUser.id },
//                     (result) => {
//                         console.log("get successful:", result);
//                         setUserData(result);
//                         setEvents(result);
//                         setIsChange(1);
//                     },
//                     (error) => {
//                         console.log("get was unsuccessful", error);
//                         setError("Error loading data");
//                     }
//                 );
//             } catch (error) {
//                 console.log("Unexpected error:", error);
//                 setError("Unexpected error loading data");
//             }
//         };
//         fetchData();
//     }, [currentUser]);

//     useEffect(() => {
//         if (!isChange || !events.length) return;

//         const fetchData = async () => {
//             setError(null);
//             try {
//                 await userService.getByForeignJoin(
//                     currentUser.autoId,
//                     userTypeObj,
//                     "Events",
//                     "hospitalizedsId",
//                     "Hospitalizeds",
//                     "hospitalizedsId",
//                     "contactId",
//                     currentUser.id,
//                     (result) => {
//                         console.log("get successful:", result);
//                         const arrayResult = Array.isArray(result) ? result : [result];
//                         setUserData(arrayResult);
//                         setEvents(arrayResult);
//                         const map = {};
//                         arrayResult.forEach(h => {
//                             if (!map[h.patientId]) map[h.patientId] = [];
//                             map[h.patientId].push(h);
//                         });
//                         setHospitalizeds(map);
//                         setIsChange(1);
//                     },
//                     (error) => {
//                         console.log("get was unsuccessful", error);
//                         setError("Error loading data");
//                     }
//                 );
//             } catch (error) {
//                 console.log("Unexpected error:", error);
//                 setError("Unexpected error loading data");
//             }
//         };

//         fetchData();
//     }, [isChange]);

//     const isPastEvent = (date) => {
//         const today = new Date().setHours(0, 0, 0, 0);
//         const eventDate = new Date(date).setHours(0, 0, 0, 0);
//         return eventDate < today;
//     };

//     const handleShowDetails = (id) => {
//         navigate(`/${currentUser.type}/${currentUser.id}/request-details/${id}`);
//     };

//     return (
//         <>
//             <div className='control'>
//                 <Sort
//                     type="requests"
//                     setIsChange={setIsChange}
//                     options={["date", "hospital", "department", "patientId"]}
//                     userData={userData}
//                     setData={setEvents}
//                 />
//                 <Search
//                     type="requests"
//                     setIsChange={setIsChange}
//                     options={["All", "hospital", "department", "patientId"]}
//                     data={userData}
//                     setData={setEvents}
//                 />
//             </div>
//             {error && <div className="error">{error}</div>}
//             <table className="requests-table">
//                 <tbody>
//                     {events && events.length > 0 ? (
//                         events.map((item) => {
//                             const isPast = isPastEvent(item.date);
//                             const hospitalizations = hospitalizeds[item.patientId] || [];
//                             return (
//                                 <tr key={item.id} style={{ backgroundColor: isPast ? '#eee' : 'white' }}>
//                                     <td>{item.date}</td>
//                                     <td>{item.startTime}</td>
//                                     <td>{item.endTime}</td>
//                                     <td>{item.roomNumber}</td>
//                                     <td>{item.hospital}</td>
//                                     <td>{item.department}</td>
//                                     <td>{item.patientId}</td>
//                                     <td>
//                                         {item.contactId === currentUser.id && (
//                                             <>
//                                                 <Update
//                                                     type="Events"
//                                                     itemId={item.id}
//                                                     setIsChange={setIsChange}
//                                                     inputs={["patientId", "hospital", "department", "roomNumber", "date", "startTime", "endTime"]}
//                                                     defaultValue={item}
//                                                     disabled={isPast}
//                                                 />
//                                                 <Delete
//                                                     type="Events"
//                                                     itemId={item.id}
//                                                     setIsChange={setIsChange}
//                                                     disabled={isPast}
//                                                 />
//                                             </>
//                                         )}
//                                         {hospitalizations.length > 0 && (
//                                             <table className="inner-table">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>בית חולים</th>
//                                                         <th>מחלקה</th>
//                                                         <th>חדר</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {hospitalizations.map((h, idx) => (
//                                                         <tr key={h.id || idx}>
//                                                             <td>{h.hospital}</td>
//                                                             <td>{h.department}</td>
//                                                             <td>{h.roomNumber}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         )}
//                                     </td>
//                                 </tr>
//                             );
//                         })
//                     ) : (
//                         <tr>
//                             <td colSpan={8}>No data to display</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </>
//     );
// }

// export default ContactRequests;
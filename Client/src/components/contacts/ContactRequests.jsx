import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodesContext } from '.././Models';
import { CurrentUser } from '.././App';
import Search from '.././Search';
import Sort from '.././Sort';
import Delete from '.././Delete';
import Update from '.././Update';
import '../../style/Posts.css';
import { userService } from '../../services/usersServices';

function ContactRequests() {
    const [userData, setUserData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);
    const { codes, loading } = useContext(CodesContext);
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    const navigate = useNavigate();
    const [hospitalizeds, setHospitalizeds] = useState([]);
    const [hospitalizationsMap, setHospitalizationsMap] = useState({});
    const didFetch = useRef(false);

    useEffect(() => {
        if (!didFetch.current && currentUser?.autoId && userTypeObj) {
            didFetch.current = true;
            userService.getByForeignJoin(
                currentUser.autoId,
                userTypeObj,
                "Hospitalizeds",
                "patientId",
                "Patients",
                "contactId",
                currentUser.id,
                { contactId: currentUser.id },
                async (result) => {
                    console.log("get successful:", result);
                    const arrayResult = Array.isArray(result) ? result : [result];
                    setUserData(arrayResult);
                    setDisplayData(arrayResult);
                    const map = {};
                    result.forEach(h => {
                        if (!map[h.patientId]) map[h.patientId] = [];
                        map[h.patientId].push(h);
                    });
                    setHospitalizationsMap(map);
                    setIsChange(1);
                },
                (error) => {
                    console.log("get was unsuccessful", error);
                    setError("Error loading data");
                }
                // (res) => setHospitalizeds(res || []),
                // (err) => console.error("Failed to fetch:", err)
            );

        }
    }, [currentUser?.autoId, userTypeObj]);

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
                        setDisplayData(result);
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
    }, [currentUser, isChange]);

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
                    setData={setDisplayData}
                />

                <Search
                    type="requests"
                    setIsChange={setIsChange}
                    options={["All", "hospital", "department", "patientId"]}
                    data={userData}
                    setData={setDisplayData}
                />
            </div>

            {error && <div className="error">{error}</div>}

            <table className="requests-table">
                <tbody>
                    {displayData && displayData.length > 0 ? (
                        displayData.map((item) => {
                            const isPast = isPastEvent(item.date);
                            const hospitalizations = hospitalizationsMap[item.patientId] || [];
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
                                        <button onClick={() => handleShowDetails(item.id)} disabled={isPast}>
                                            Details
                                        </button>
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
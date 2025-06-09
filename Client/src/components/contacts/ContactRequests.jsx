import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUser } from '.././App';
import Search from '.././Search';
import Sort from '.././Sort';
import Delete from '.././Delete';
import Update from '.././Update';
import '../../style/Posts.css';
import { apiService } from '../../../services/genericServeices';

function ContactRequests() {
    const [userData, setUserData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [isAll, setIsAll] = useState(false);
    const [displayData, setDisplayData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        setError(null);
        if (!currentUser || !currentUser.id) {
            setError("משתמש לא מחובר");
            return;
        }
        const fetchData = async () => {
            try {
                await apiService.getByValue(
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
                    });
            } catch (error) {
                console.log("Unexpected error:", error);
            }
        };
        fetchData();
    }, [currentUser, isChange]);

    useEffect(() => {
        setError(null);
        if (!currentUser || !currentUser.id) {
            return;
        }
        if (!isAll) {
            setAllData([]);
            return;
        }
        const fetchAll = async () => {
            try {
                const data = await apiService.getAll(
                    currentUser.autoId,
                    "Events",
                    (data) => {
                        setAllData(data);
                        setDisplayData(data);
                        setIsChange(1);
                        console.log("get all successful:", data);
                    },
                    (err) => {
                        setError(`שגיאה בטעינת כל הפניות: ${err}`);
                    }
                );
                setAllData(data || []);
            } catch (err) {
                setError(`שגיאה בטעינת כל הפניות: ${err.message || err}`);
            }
        };
        fetchAll();
    }, [currentUser, isAll, isChange]);

    useEffect(() => {
        setDisplayData(isAll ? allData : userData);
    }, [isAll, userData, allData]);

    const handleShowDetails = (id) => {
        navigate(`/${currentUser.type}/${currentUser.id}/request-details/${id}`);
    };

    return (
        <>
            <div className='control'>
                <button onClick={() => setIsAll(prev => !prev)}>
                    {isAll ? "המידע שלי" : "כל המידע"}
                </button>

                <Sort
                    type={"requests"}
                    setIsChange={setIsChange}
                    options={["date", "hospital", "department", "patientId"]}
                    userData={displayData}
                    setData={setDisplayData}
                />

                <Search
                    type={"requests"}
                    setIsChange={setIsChange}
                    options={["All", "hospital", "department", "patientId"]}
                    data={displayData}
                    setData={setDisplayData}
                />
            </div>

            {error && <div className="error">{error}</div>}

            <table className="requests-table">
                <tbody>
                    {displayData && displayData.length > 0 ? (
                        displayData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.startTime}</td>
                                <td>{item.endTime}</td>
                                <td>{item.roomNumber}</td>
                                <td>{item.hospital}</td>
                                <td>{item.department}</td>
                                <td>{item.patientId}</td>
                                <td>
                                    <button onClick={() => handleShowDetails(item.id)}>פרטים</button>
                                    {console.log("item.id", item.id, "item.contactId", item.contactId, "currentUser.id", currentUser.id)}
                                    {item.contactId === currentUser.id && (
                                        <>
                                            <Update
                                                type="Events"
                                                itemId={item.id}
                                                setIsChange={setIsChange}
                                                inputs={["patientId", "hospital", "department", "roomNumber", "date", "startTime", "endTime"]}
                                                defaultValue={item}
                                            />
                                            <Delete
                                                type="Events"
                                                itemId={item.id}
                                                setIsChange={setIsChange}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>אין נתונים להצגה</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default ContactRequests;

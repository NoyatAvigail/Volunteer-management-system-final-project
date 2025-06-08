// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CurrentUser } from './App';
// import Search from './Search';
// import Sort from './Sort';
// import Add from './Add';
// import Delete from './Delete';
// import Update from './Update';
// import '../style/Posts.css';
// import { apiService } from '../../services/genericServeices';

// function Contacts() {
//     const [userData, setUserData] = useState([]);
//     const [allData, setAllData] = useState([]);
//     const [isAll, setIsAll] = useState(0);
//     const [displayData, setDisplayData] = useState([]);
//     const [error, setError] = useState(null);
//     const [isChange, setIsChange] = useState(0);
//     const [displayDetails, setDisplayDetails] = useState(null);
//     const { currentUser } = useContext(CurrentUser);
//     const navigate = useNavigate();

//     useEffect(() => {
//         setIsChange(0);
//         if (!currentUser || !currentUser.id) {
//             setError("User is not logged in");
//             return;
//         }
//         const fetchData = async () => {
//             await apiService.getByValue(
//                 currentUser.id,
//                 "requests",
//                 { userId: currentUser.id },
//                 setUserData,
//                 (err) => setError(`שגיאה בטעינת מידע אישי: ${err}`)
//             );
//         };
//         // fetchData();
//     }, [currentUser.id, isChange]);

//     useEffect(() => {
//         setIsChange(0);
//         if (!currentUser || !currentUser.id) {
//             return;
//         }
//         const fetchAll = async () => {
//             await apiService.getAll(
//                 currentUser.id,
//                 "requests",
//                 setAllData,
//                 (err) => setError(`שגיאה בטעינת כל הנתונים: ${err}`)
//             );
//         };
//         // fetchAll();
//     }, [isChange]);

//     useEffect(() => {
//         setDisplayData(isAll === 0 ? userData : allData);
//     }, [isAll, userData, allData]);

//     return (
//         <>
//             <div className='control'>
//                 <button onClick={() => setIsAll(prev => !prev)}>
//                     {isAll === 0 ? "כל המידע" : "המידע שלי"}
//                 </button>

//                 <Sort
//                     type={"requests"}
//                     setIsChange={setIsChange}
//                     options={["dateTime", "hospital", "department", "patientId"]}
//                     userData={displayData}
//                     setData={setDisplayData}
//                 />

//                 <Search
//                     type={"requests"}
//                     setIsChange={setIsChange}
//                     options={["All", "hospital", "department", "patientId"]}
//                     data={displayData}
//                     setData={setDisplayData}
//                 />

//                 <Add
//                     type="requests"
//                     setIsChange={setIsChange}
//                     inputs={["patientId", "contactId", "hospital", "department", "roomNumber", "date", "startTime", "endTime"]}
//                     defaultValue={{
//                         patientId: "",
//                         contactId: currentUser.id,
//                         hospital: "",
//                         department: "",
//                         roomNumber: "",
//                         date: "",
//                         startTime: "",
//                         endTime: ""
//                     }}
//                     name="הוסף פנייה"
//                 />
//             </div>
//         </>
//     );
// }
// export default Contacts;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUser } from './App';
import Search from './Search';
import Sort from './Sort';
import Add from './Add';
import Delete from './Delete';
import Update from './Update';
import '../style/Posts.css';
import { apiService } from '../../services/genericServeices';

function Contacts() {
    const [userData, setUserData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [isAll, setIsAll] = useState(false);
    const [displayData, setDisplayData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    console.log("currentUser:", currentUser);

    useEffect(() => {
        setError(null);
        if (!currentUser || !currentUser.id) {
            setError("משתמש לא מחובר");
            return;
        }
        const fetchData = async () => {
            try {
                const data = await apiService.getByValue(currentUser.id, "requests", { contactId: currentUser.id });
                setUserData(data || []);
            } catch (err) {
                setError(`שגיאה בטעינת הפניות שלי: ${err.message || err}`);
            }
        };
        // fetchData();
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
                const data = await apiService.getAll(currentUser.id, "requests");
                setAllData(data || []);
            } catch (err) {
                setError(`שגיאה בטעינת כל הפניות: ${err.message || err}`);
            }
        };
        // fetchAll();
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

                {/* <Add
                    type="requests"
                    setIsChange={setIsChange}
                    inputs={["patientId", "contactId", "hospital", "department", "roomNumber", "date", "startTime", "endTime"]}
                    defaultValue={{
                        patientId: "",
                        contactId: currentUser?.id || "",
                        hospital: "",
                        department: "",
                        roomNumber: "",
                        date: "",
                        startTime: "",
                        endTime: ""
                    }}
                    name="הוסף פנייה"
                /> */}
            </div>

            {error && <div className="error">{error}</div>}

            <table className="posts-table">
                <thead>
                    <tr>
                        <th>תאריך</th>
                        <th>בית חולים</th>
                        <th>מחלקה</th>
                        <th>מספר מטופל</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {displayData && displayData.length > 0 ? (
                        displayData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.hospital}</td>
                                <td>{item.department}</td>
                                <td>{item.patientId}</td>
                                <td>
                                    <button onClick={() => handleShowDetails(item.id)}>פרטים</button>
                                    <Update
                                        type="requests"
                                        id={item.id}
                                        setIsChange={setIsChange}
                                        inputs={["patientId", "hospital", "department", "roomNumber", "date", "startTime", "endTime"]}
                                        defaultValue={item}
                                    />
                                    <Delete
                                        type="requests"
                                        id={item.id}
                                        setIsChange={setIsChange}
                                    />
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

export default Contacts;
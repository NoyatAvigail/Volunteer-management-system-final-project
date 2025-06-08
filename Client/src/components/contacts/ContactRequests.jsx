import React, { useState, useEffect, useContext } from 'react';
import { CurrentUser } from '.././App';
import Search from '.././Search';
import Sort from '.././Sort';
import Add from '.././Add';
import { apiService } from '../../../services/genericServeices';

function ContactRequests() {
    const [userData, setUserData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [isAll, setIsAll] = useState(0);
    const [displayData, setDisplayData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);

    useEffect(() => {
        setIsChange(0);
        if (!currentUser || !currentUser.id) {
            setError("User is not logged in");
            return;
        }
        const fetchData = async () => {
            await apiService.getByValue(
                currentUser.id,
                "requests",
                { userId: currentUser.id },
                setUserData,
                (err) => setError(`שגיאה בטעינת מידע אישי: ${err}`)
            );
        };
        fetchData();
    }, [currentUser.id, isChange]);

    useEffect(() => {
        setIsChange(0);
        if (!currentUser || !currentUser.id) {
            return;
        }
        const fetchAll = async () => {
            await apiService.getAll(
                currentUser.id,
                "requests",
                setAllData,
                (err) => setError(`שגיאה בטעינת כל הנתונים: ${err}`)
            );
        };
        fetchAll();
    }, [isChange]);

    useEffect(() => {
        setDisplayData(isAll === 0 ? userData : allData);
    }, [isAll, userData, allData]);

    return (
        <div className='control'>
            <button onClick={() => setIsAll(prev => !prev)}>
                {isAll === 0 ? "כל המידע" : "המידע שלי"}
            </button>

            <Sort
                type="requests"
                setIsChange={setIsChange}
                options={["dateTime", "hospital", "department", "patientId"]}
                userData={displayData}
                setData={setDisplayData}
            />

            <Search
                type="requests"
                setIsChange={setIsChange}
                options={["All", "hospital", "department", "patientId"]}
                data={displayData}
                setData={setDisplayData}
            />
        </div>
    );
}

export default ContactRequests;
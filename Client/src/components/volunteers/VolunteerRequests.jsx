import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCodes } from '../Models';
import { CurrentUser } from '../App';
import Add from '../Add';
import Search from '../Search';
import Sort from '../Sort';
import Update from '../Update';
// import '../../style/Posts.css';
import { requestService } from '../../services/requestsServices';
import { volunteerService } from '../../services/volunteersServices';

function VolunteerRequests() {
  const [userData, setUserData] = useState([]);
  const [events, setEvents] = useState([]);
  const [isChange, setIsChange] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(CurrentUser);
  const { codes } = useCodes();
  const didFetch = useRef(false);
  const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;

  const noAccess = !currentUser || userTypeObj !== 'Volunteer';

  const fetchData = async () => {
    try {
      const startDate = '2025-06-01';
      const endDate = '2025-08-31';
      await requestService.getAll(
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

  useEffect(() => {
    if (!didFetch.current && currentUser?.id && userTypeObj === 'Volunteer') {
      didFetch.current = true;
      fetchData();
    }
  }, [currentUser, userTypeObj]);

  const handleTakeCall = (callId) => {
    if (!currentUser) return;
    requestService.patch(
      'requests',
      null,
      { callId },
      () => {
        setEvents(prev => prev.filter(call => call.id !== callId));
      },
      (err) => {
        console.error("Error taking call:", err);
        alert("שגיאה בעת ניסיון לקחת את הקריאה");
      }
    );
  };

  return (
    <>
      <div className="control">
        <Sort
          type="requests"
          setIsChange={setIsChange}
          options={["date", "hospital", "department", "roomNumber"]}
          userData={userData}
          setData={setEvents}
        />
        <Search
          type="requests"
          setIsChange={setIsChange}
          options={["All", "hospital", "department", "roomNumber"]}
          data={userData}
          setData={setEvents}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="requests">
        <h2>Open Requests</h2>
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
              events.map(item => (
                <tr key={item.id}>
                  <td>{item.Hospitalized.Patient?.fullName}</td>
                  <td>{item.Hospitalized.patientId}</td>
                  <td>{item.Hospitalized.Hospital?.description}</td>
                  <td>{item.Hospitalized.Department?.description}</td>
                  <td>{item.Hospitalized.roomNumber}</td>
                  <td>{new Date(item.date).toISOString().split('T')[0]}</td>
                  <td>{item.startTime}</td>
                  <td>{item.endTime}</td>
                  <td>
                    <button onClick={() => handleTakeCall(item.id)}>אני לוקח</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>אין קריאות זמינות כרגע</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default VolunteerRequests;
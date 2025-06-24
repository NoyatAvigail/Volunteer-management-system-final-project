import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCodes } from '../Models';
import { CurrentUser } from '../App';
import Search from '../Search';
import Sort from '../Sort';
import { requestsServices } from '../../services/requestsServices';

function VolunteerRequests() {
  const [userData, setUserData] = useState([]);
  const [events, setEvents] = useState([]);
  const [isChange, setIsChange] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(CurrentUser);
  const { codes } = useCodes();
  const didFetch = useRef(false);
  const [startDate, setStartDate] = useState('01/01/2020');
  const [endDate, setEndDate] = useState('01/07/2027');
  const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;

  const noAccess = !currentUser || userTypeObj !== 'Volunteer';

  const fetchData = async () => {
    try {
      await requestsServices.getAll(
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
  // const triggerRefresh = () => setIsChange(prev => !prev);
  useEffect(() => {
    if (!didFetch.current && currentUser?.id && userTypeObj === 'Volunteer') {
      didFetch.current = true;
      fetchData();
    }
  }, [currentUser, userTypeObj]);

  const handleTakeCall = async (callId) => {
    if (!currentUser) return;
    await requestsServices.update(
      callId,
      {},
      () => {
        setEvents(prev => prev.filter(call => call.id !== callId));
      },
      (err) => {
        console.error("Error taking call:", err);
        alert("Error while trying to take the reading");
      }
    );
  };

  return (
    <>
      <div className="control">
        <Sort
          type="requests"
          userData={userData}
          setData={setEvents}
        />
        <Search
          setIsChange={setIsChange}
          options={["All", "hospital", "department"]}
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
              {/* <th>Patient name</th>
              <th>Patient id</th> */}
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
                  {/* <td>{item.Hospitalized.Patient?.fullName}</td>
                  <td>{item.Hospitalized.patientId}</td> */}
                  <td>{item.Hospitalized.Hospital?.description}</td>
                  <td>{item.Hospitalized.Department?.description}</td>
                  <td>{item.Hospitalized.roomNumber}</td>
                  <td>{new Date(item.date).toISOString().split('T')[0]}</td>
                  <td>{item.startTime}</td>
                  <td>{item.endTime}</td>
                  <td>
                    <button onClick={() => handleTakeCall(item.id)}>I'm taking</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No readings available at this time</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default VolunteerRequests;
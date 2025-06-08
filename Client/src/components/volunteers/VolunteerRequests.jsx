import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Requests() {
  const [openCalls, setOpenCalls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

  return (
    <div className="section">
      <h2>בקשות פתוחות</h2>
      {openCalls.map(call => (
        <div key={call.id} className="post-item">
          <p>#{call.id}</p>
          <p>סוג: {call.type}</p>
          <p>כתובת: {call.address}</p>
          <button onClick={() => navigate(`/take-call/${call.id}`)}>אני לוקח</button>
        </div>
      ))}
    </div>
  );
}

export default Requests;

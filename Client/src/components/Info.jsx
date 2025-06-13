import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function Info({ setIsShowInfo }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('currentUser'));
    if (localUser) {
      try {
        setUser(localUser);
      } catch (err) {
        console.error('Failed to parse user from cookie:', err);
      }
    }
  }, []);

  if (!user) return <div className="info">Loading...</div>;

  return (
    <div className="info">
      <div className="text">
        <h3 className="info-title">user information</h3><br />
        <p>fullName: {user.fullName}</p><br />
        <p>email: {user.email}</p><br />
        <p>phone: {user.phone}</p><br />
        <button onClick={() => setIsShowInfo(0)}>Close</button>
      </div>
    </div>
  );
}

export default Info;
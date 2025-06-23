import React from 'react';
import '../style/Home.css'; 

function Contact() {
    return (
        <div className="home-container">
            <h1>Welcome, dear contact person!</h1>
            <p className="slogan">MAKING A DIFFERENCE TOGETHER</p>
            <p>
                Your role is essential. You are the bridge between patients in need and the volunteers who are ready to help.
                <br />
                With your support, we can ensure that every patient receives the care and attention they deserve.
            </p>
            <p>
                The system allows you to easily register patients and submit specific requests — and we’ll do everything we can to find the right volunteer for each one.
            </p>
            <h2>What you can do:</h2>
            <ul>
                <li>Register a new patient quickly and easily</li>
                <li>Submit requests for support or presence</li>
                <li>Track the status of each request</li>
                <li>Stay informed with real-time updates when a volunteer is assigned</li>
            </ul>
            <p className="highlight">Your involvement makes a difference.</p>
            <p className="highlight">Together – we’re building a network of care and compassion.</p>
        </div>
    );
}

export default Contact;
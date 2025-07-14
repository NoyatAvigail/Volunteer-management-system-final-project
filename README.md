# Volunteer Management System – Final Project

Welcome to our humanitarian volunteering platform!  
This system connects hospital contact people with dedicated volunteers, creating a network of care, kindness, and meaningful assistance.

## 💡 Project Overview

This full-stack web application was developed using **React, Node.js, and MySQL**.  
It supports two types of users: **volunteers** and **contact people** (hospital staff or family members).  
Each user type has its own dashboard and capabilities tailored to their role.

### 👩‍⚕️ Volunteers can:
- Set volunteering preferences (sector, gender, hospital, department)
- Receive matching shift requests based on their preferences
- Accept or reject shift offers
- Track volunteering history and download certificates of appreciation

### 🧑‍💼 Contact people can:
- Register new patients and their needs
- Submit requests for support or presence
- Track the status of each request
- Get notified when a volunteer is assigned

## ⚙️ Technologies Used

**Frontend:**  
- React, React Router, Hooks  
- Context API for user sessions  
- Styled with CSS modules  

**Backend:**  
- Node.js + Express  
- RESTful API  
- Sequelize ORM  
- JWT authentication  
- Role-based access control (volunteer / contact person)  
- Three-layer architecture: Controller, Service, DAL  

**Database:**  
- MySQL with relational structure  
- Tables for Users, Volunteers, ContactPeople, Patients, Events, Availability, Preferences, etc.

## 🌟 Features

- Interactive multi-step registration
- Personal dashboards by role
- Matching engine for volunteers and patients
- Shift tracking and status updates
- Secure login & authentication
- JWT token handling
- Certificate generation for volunteers
- Admin-ready structure with scalable codebase

## 🚀 Run Locally

```bash
git clone https://github.com/YourUsername/Volunteer-management-system-final-project.git
cd Volunteer-management-system-final-project

# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install

# Create a .env file in Server with DB and JWT secrets

# Start the server and client (in separate terminals)
npm start

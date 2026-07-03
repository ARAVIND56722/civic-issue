## 🏙️ CivicConnect – Smart Civic Issue Reporting & Tracking System


## 📌 Project Overview

CivicConnect is a citizen-centric civic issue reporting and tracking platform designed to bridge the communication gap between citizens and municipal authorities. The system enables residents to report public infrastructure and community-related issues such as potholes, garbage accumulation, water leakage, drainage problems, damaged streetlights, and other civic concerns.

The platform provides real-time issue tracking, image-based evidence submission, status monitoring, and centralized complaint management, ensuring greater transparency, accountability, and efficiency in public service operations.

By digitizing the complaint lifecycle, CivicConnect empowers citizens while helping authorities prioritize, monitor, and resolve issues more effectively.


## Loom video : https://www.loom.com/share/0f0ca8f0e9d8430b8cdbf200dafa9e0e


## 🎯 Problem Statement

Traditional civic complaint systems often face several challenges:

Manual and paper-based complaint registration
Lack of transparency in issue resolution
Delayed response from authorities
Absence of real-time tracking
Inefficient communication between citizens and government departments
Difficulty in prioritizing and monitoring complaints

CivicConnect addresses these challenges by providing a centralized digital platform for reporting, managing, and tracking civic issues.

## 🚀 Features

## 👥 Citizen Module

- Secure User Registration & Login
- JWT-Based Authentication
- Report Civic Issues
- Upload Issue Images
- GPS-Based Location Reporting
- Categorize Complaints
- View Submitted Issues
- Track Complaint Status
- View Complaint History
- Receive Real-Time Notifications
- Detailed Complaint Timeline

### Complaint Status Flow

Submitted → Acknowledged → In Progress → Resolved

---

## 🛠️ Admin Module

- Secure Admin Authentication
- Interactive Dashboard
- View All Reported Issues
- Filter & Search Complaints
- Assign Issues to Departments
- Update Issue Status
- Manage Complaint Categories
- View Uploaded Images
- View Issue Location on Map
- Monitor Resolution Progress
- Send Notifications to Citizens
- Access Complaint History Logs

---

## 🔔 Notification System

- Status Change Notifications
- Assignment Updates
- Resolution Alerts
- Real-Time Complaint Updates

  ---
## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Citizens                     Municipal Authorities/Admins  │
│     │                                      │                │
│     └───────────────┬──────────────────────┘                │
│                     │                                       │
└─────────────────────▼───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│          React.js Frontend Application                      │
│                                                             │
│  • User Authentication                                      │
│  • Issue Reporting Interface                               │
│  • Complaint Tracking Dashboard                            │
│  • Admin Management Dashboard                              │
│  • Map-Based Issue Visualization                           │
│  • Notification Center                                     │
│                                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API Requests
                      ▼

┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                Node.js + Express.js API                     │
│                                                             │
│  • Authentication & Authorization                           │
│  • Complaint Management Service                             │
│  • Department Assignment Service                            │
│  • Status Tracking Service                                  │
│  • Notification Service                                     │
│  • File Upload Management                                   │
│  • Geo-Location Processing                                  │
│                                                             │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
               │                      │
               ▼                      ▼

┌──────────────────────┐    ┌───────────────────────────────┐
│   CLOUDINARY STORAGE │    │       MONGODB DATABASE        │
├──────────────────────┤    ├───────────────────────────────┤
│                      │    │                               │
│ • Issue Images       │    │ • Users Collection           │
│ • Evidence Photos    │    │ • Issues Collection          │
│ • Media Management   │    │ • Notifications Collection   │
│                      │    │ • Status History Collection  │
│                      │    │ • Department Records         │
│                      │    │                               │
└──────────────────────┘    └───────────────────────────────┘

                      ▲
                      │
                      │
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYER                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  • JWT Authentication                                       │
│  • Role-Based Access Control (RBAC)                         │
│  • Password Hashing (bcrypt)                                │
│  • API Route Protection                                     │
│  • Input Validation & Sanitization                          │
│  • Secure Environment Variables                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
  

## 🏗️ Technology Stack

## Frontend

- React.js
- Bootstrap
- Axios
- React Router

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose ODM

## Authentication & Security

- JWT Authentication
- Password Hashing (bcrypt)

## File Management

- Multer
- Cloudinary

## Mapping & Location Services

- GeoJSON
- Interactive Map Integration

## Development Tools

- Git
- GitHub
- Postman
- VS Code

---

## 📊 Core Functionalities
- Functionality	Description
- Complaint Reporting	Submit civic complaints
- Image Upload	Attach supporting evidence
- Issue Tracking	Track complaint progress
- Complaint History	View previously reported issues
- Admin Dashboard	Manage all complaints
- Status Updates	Real-time progress updates
- Priority Handling	Critical issue management
- Resolution Monitoring	Complaint closure tracking
  
 ---
 
## 🔒 Security Features
- Secure Authentication
- Password Hashing
- Session Management
- Role-Based Access Control
- Input Validation
- Secure File Uploads
- Protected API Endpoints
  
  ---
  
## Screenshots
  
## Welcome Page
  
<img width="562" height="535" alt="image" src="https://github.com/user-attachments/assets/cd107bac-d106-4b06-97be-d1f0ec5008b2" />

<img width="942" height="600" alt="image" src="https://github.com/user-attachments/assets/91673343-5d95-45e1-8504-093203b081cf" />

## Citizen Portal
  
<img width="526" height="572" alt="image" src="https://github.com/user-attachments/assets/3d4a2adf-b8c5-434b-b816-b2ad6d6654dc" />

<img width="1872" height="917" alt="image" src="https://github.com/user-attachments/assets/1291253d-7144-4421-88b5-2baa864088ab" />

<img width="807" height="855" alt="image" src="https://github.com/user-attachments/assets/23f0470f-09f3-4179-a4d1-f2bacc39ca71" />

## users all the reported issues

<img width="1868" height="777" alt="image" src="https://github.com/user-attachments/assets/89dda5d2-2271-4e41-ac4b-dfeea0a0915c" />

<img width="1227" height="842" alt="image" src="https://github.com/user-attachments/assets/82a615c6-1950-4005-9c32-c3b1840586e5" />

 ## Admin Portal 

 <img width="533" height="586" alt="image" src="https://github.com/user-attachments/assets/7b6bf31c-f05d-493a-9ccd-ec812a4ad501" />
 
 <img width="1877" height="813" alt="image" src="https://github.com/user-attachments/assets/9600a565-e82d-4301-8145-3c5683d402f3" />

 ---
 
## 📈 Future Enhancements
- AI-Based Issue Categorization
- AI-Powered Complaint Prioritization
- Smart Recommendation Engine
- GIS & Interactive Map Integration
- Mobile Application Support
- SMS Notifications
- Email Notifications
- Real-Time Push Notifications
- Multi-Language Support
- Government Portal Integration
- Smart City Infrastructure Integration
- Analytics & Reporting Dashboard
- Predictive Maintenance System

  ---
  
## 🌟 Expected Impact

- Increased citizen engagement
- Improved transparency
- Faster issue resolution
- Better accountability
- Efficient municipal operations
- Enhanced public satisfaction
- Support for smart city initiatives

---

## 👨‍💻 Author
 ## Aravindhan AK

  ##   Software Developer | Full-Stack Developer | Problem Solver

GitHub: [https://github.com/ARAVIND5672]

LinkedIn: [www.linkedin.com/in/aravind345]

Email: [akaravind241@gmail.com]



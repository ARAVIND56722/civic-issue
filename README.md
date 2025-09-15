🏙️ Citizen Issue Reporting & Tracking System
📌 Overview

The Citizen Issue Reporting & Tracking System is a full-stack web application that allows citizens to easily report civic issues (like potholes, garbage, electricity faults, water leaks, etc.) and track their status in real time.
It improves transparency, accountability, and efficiency in resolving local issues by providing a citizen portal and an admin dashboard.

🚀 Features
👥 For Citizens

Sign up & log in securely

Report issues with title, description, category, photo, and GPS location

View all issues they reported

Track the status timeline (Submitted → Acknowledged → In-progress → Resolved)

View detailed issue description with history

🛠️ For Admins

View all reported issues in an interactive dashboard

Assign issues to departments (Sanitation, Roads, Electricity, etc.)

Update issue status (with validation rules)

View issue details with photo, map location, and history

Send real-time notifications to citizens

🏗️ Tech Stack

Frontend: React.js, Bootstrap

Backend: Node.js

Database: MongoDB (Mongoose ODM)

Authentication: JWT (JSON Web Tokens)

File Uploads: Cloudinary + Multer

Maps/GPS: GeoJSON & Map integration


📍 Project Workflow

Citizen logs in and reports an issue (with description, photo, and GPS location).

Issue is stored in MongoDB with initial status = “Submitted”.

Admin logs in and can view, update status, or assign the issue.

Citizen gets real-time updates on their reported issue.

Status timeline is maintained for full transparency.

📊 Block Diagram
Citizen → Report Issue → Backend API → MongoDB
Citizen ← Status Updates ← Backend API
Admin → Manage Issues → Backend API → MongoDB

🌟 Real-World Impact

Makes complaint management faster and more transparent

Builds trust between citizens and administration

Can be extended for Smart City e-Governance


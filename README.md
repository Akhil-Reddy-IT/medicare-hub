# MediCare Hub - Smart Healthcare Management Platform

MediCare Hub is a production-ready, highly secure, and responsive digital healthcare platform utilizing the **MERN (MongoDB, Express, React, Node.js) Stack** integrated with **Google Gemini AI**. It allows patients, doctors, and system administrators to manage clinical schedules, bookings, and medical history documents while gaining automated diagnostics insights, symptom assessments, and report summaries.

---

## 🚀 Features

### 1. Patient Portal
* **Dashboard Overview**: Access active bookings, recent document uploads, and wellness recommendations.
* **Symptom Checker**: Interactive symptom input with risk level warnings, possible condition probabilities, and clinical precautions.
* **AI Report Explanation**: Upload laboratory test reports (PDFs/Images) and request Gemini to explain them in simple layman terms.
* **Online Booking**: Search doctors by specialization, hospital network, or fees, and select active consult hours.
* **History Tracker**: Edit, reschedule, or cancel pending bookings, and view doctor prescriptions.

### 2. Doctor Portal
* **Patient Records Lookup**: Access historical charts and records uploaded by authorized consulting patients.
* **Consultation Desk**: Manage patient bookings, complete diagnostics records, and file prescription files.
* **Schedule Manager**: Instantly add or delete time slots to configure daily clinic availability.

### 3. Administrator Console
* **Analytics Center**: Visual metrics (patient/doctor distributions, specialization shares) plotted via **Recharts**.
* **Account Moderation**: Edit user credentials or securely delete account profiles from the MongoDB server.
* **Appointment Audit**: Reschedule, confirm, or delete entries from a master booking list.

---

## 🛠️ Technology Stack
* **Frontend**: React.js (Vite), React Router DOM, Tailwind CSS v3, Axios, Recharts, Framer Motion, Lucide Icons, React Hook Form.
* **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer, Nodemailer, Express Validator, Helmet, Mongo Sanitize.
* **Database**: MongoDB (Mongoose Object Modeling).
* **AI Engine**: Google Gemini API SDK (`@google/generative-ai` model: `gemini-1.5-flash`).

---

## 📁 Project Folder Structure

```
medicare-hub/
├── backend/
│   ├── config/          # MongoDB database connection helper
│   ├── controllers/     # Route logic handlers (Auth, Records, AI, Doctors, Appointments, Admin)
│   ├── middleware/      # JWT guards, upload filters, global error catching
│   ├── models/          # Database collection schemas
│   ├── routes/          # API routing declarations
│   ├── services/        # Google Gemini API integrations
│   ├── uploads/         # Local folder hosting medical record uploads
│   ├── .env.example     # Template showing required backend variables
│   ├── package.json     # Node script configuration
│   └── server.js        # Server initialization and middleware mapping
├── frontend/
│   ├── src/
│   │   ├── components/  # Layout structures, sidebars, protected route guards
│   │   ├── context/     # AuthContext global session state
│   │   ├── pages/       # Portal pages (Home, Login, Symptom Checker, Dashboards, etc.)
│   │   ├── services/    # Axios client endpoints mapping
│   │   ├── App.jsx      # Navigation routing matrix
│   │   ├── main.jsx     # DOM entry render script
│   │   └── index.css    # Tailwind base styles and custom glassmorphism styles
│   ├── index.html       # HTML entry point
│   ├── postcss.config.js# Tailwind build configurations
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json     # Frontend dependencies configuration
└── README.md
```

---

## 🔑 Environment Variables Configuration

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medicare-hub
JWT_SECRET=super_secure_jwt_secret_change_me
GEMINI_API_KEY=your_google_gemini_api_key_here

# Nodemailer setup (optional for notification logs)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

## ⚡ Quick Setup Instructions

### Prerequisites
* Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).
* Run a local MongoDB instance, or secure a [MongoDB Atlas connection URI](https://www.mongodb.com/cloud/atlas).
* Secure a Google Gemini API Key from the [Google AI Studio](https://aistudio.google.com/).

### Running the Application

1. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Launch Backend Server**:
   ```bash
   # Starts server on http://localhost:5000
   npm run start
   # Or for hot-reloading development
   npm run dev
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Launch Frontend Development Server**:
   ```bash
   # Starts Vite development server on http://localhost:5173
   npm run dev
   ```

---

## 🛡️ Security Protections
* **JWT Authorization**: Secured endpoints require a valid Bearer token.
* **NoSQL Injection**: Implements `express-mongo-sanitize` to purge query injection patterns.
* **Header Security**: Mounts `helmet` middleware to enforce secure HTTP header layers.
* **CORS Limits**: Enabled for request routing security.
* **Validator Sanitizers**: Utilizes `express-validator` to reject malicious registration queries.
* **Password Hashing**: Implements 10-salt bcrypt encrypt parameters.


---

## ⚛️ **2️⃣ Frontend — `primetrade-frontend/README.md`**

```markdown
# ⚛️ PrimeTrade Frontend

Modern **React + Vite** based frontend for interacting with the PrimeTrade backend APIs.  
Implements user authentication, protected dashboard, and admin product management.

---

## 🧩 Tech Stack
- **React.js (Vite)**
- **Axios** for API communication
- **React Router DOM**
- **SweetAlert2** for alerts
- **JWT LocalStorage Authentication**

---

## 🧠 Features
✅ Register / Login with backend API  
✅ JWT token storage & role-based access  
✅ Dashboard with Product List  
✅ Admin: Add, Edit, Delete Products  
✅ Modern UI with gradient styling  
✅ Sweet Alerts & Loaders  

---

## ⚙️ How to Run

1️⃣ Install dependencies:
2️⃣ Start the server:
npm run dev

3️⃣ Open in browser:
http://localhost:5173/

Connect with Backend
Make sure your backend (Spring Boot) runs on port 8080
and src/api/axios.js has this line:
const api = axios.create({
  baseURL: "http://localhost:8080",
});

📁 Folder Structure
primetrade-frontend/
 ┣ src/
 ┃ ┣ api/
 ┃ ┃ ┗ axios.js
 ┃ ┣ components/
 ┃ ┃ ┗ Loader.jsx
 ┃ ┣ pages/
 ┃ ┃ ┣ Login.jsx
 ┃ ┃ ┣ Register.jsx
 ┃ ┃ ┗ Dashboard.jsx
 ┃ ┣ App.jsx
 ┃ ┗ main.jsx
 ┣ package.json
 ┗ README.md

🧾 Author
skislam0977@gmail.com



```bash
npm install

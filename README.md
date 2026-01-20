# PetStuff - Fullstack E-Commerce Platform 🐾

**PetStuff** is a modern, full-stack e-commerce application designed for pet owners. It features a seamless shopping experience, secure authentication, and a powerful admin dashboard for store management. Built with the **MERN Stack** (MongoDB, Express, React, Node.js), this project demonstrates scalable architecture and user-centric design.

---

##  Live Demo

-  [Frontend Live Link](https://petstuff-a-pet-stuff-fullstack-ecom.vercel.app)
-  [Backend Live Link](https://petstuff-backend.vercel.app/)

---

##  Key Features

###  Customer Experience
- **Responsive Design**: Mobile-first UI built with **Tailwind CSS**.
- **User Authentication**: Secure signup/login via Email & **Google OAuth**.
- **Product Discovery**: Search, filter, and view detailed product information.
- **Shopping Cart**: Real-time cart management with persistent state.
- **Order Management**: Track order status and view history.
- **Profile Management**: Update personal details and password securely.


###  Admin Dashboard
- **Product Management**: Create, edit, and delete products with image uploads (**Cloudinary**).
- **Store Management**: Manage store details and settings.
- **Order Analytics**: Visualize sales data and order statuses.
- **Role-Based Access**: Secure admin-only routes and actions.


---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS**
- **Context API** (State Management)
- **Axios** (API Integration)
- **React-hot-toast** (To show toasts to the user)
- **Lucide-react** (For Icons)
- **Recharts** (To deal with admin analytics chart)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** (Database)
- **JWT** (Authentication)
- **Passport.js** (Google OAuth)
- **Nodemailer** (Email verification)
- **Cloudinary** (Image Storage)
- **Multer** (As a gatekeeper)

---

## ⚙️ Environment Variables

To run this project, you need to configure the following environment variables.

### Backend (`/backend/.env`)

| Variable | Description |
| :--- | :--- |
| `PORT` | API Port (e.g., `8080`) |
| `MONGO_URI` | MongoDB Connection String |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_URL` | Cloudinary API URL |
| `EMAIL_USERNAME` | Nodemailer Email |
| `EMAIL_PASSWORD` | 16 Digits App Password Created By Google |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `GOOGLE_CALLBACK_URL` | Google Callback URL |
| `FRONTEND_URL` | URL of the frontend (e.g., `http://localhost:5173` or Vercel URL) |

### Frontend (`/frontend/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Backend API URL (e.g., `http://localhost:8080/api` or Vercel URL) |

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Cluster

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohdSayam/petstuff---a-pet-stuff-fullstack-ecommerce--.git
   cd petstuff
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file with your credentials
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   # Create .env file with VITE_API_URL
   npm run dev
   ```

---

## ☁️ Deployment Guide (Vercel)

This project is deployed using the "Chicken and Egg" strategy to handle circular dependencies between frontend and backend URLs.

### Step 1: Deploy Backend
1. Deploy the `backend` folder to Vercel.
2. Set `FRONTEND_URL` to a placeholder initially (e.g., `https://temp-frontend.vercel.app`).
3. Note the generated **Backend URL**.

### Step 2: Deploy Frontend
1. Deploy the `frontend` folder to Vercel.
2. Set `VITE_API_URL` to your **Backend URL** + `/api`.
3. Note the generated **Frontend URL**.

### Step 3: Final Configuration
1. Go back to your Backend project on Vercel.
2. Update `FRONTEND_URL` to the real **Frontend URL**.
3. Redeploy the Backend.
4. **Important**: Add your production URLs to the **Google Cloud Console** (Authorized Redirect URIs).

---

## 👨 Author

**Mohd Sayam**  
- [GitHub Profile](https://github.com/MohdSayam)
- [LinkedIn](www.linkedin.com/in/mohd-sayam-b29106322)

---

> *"Built with ❤️ and code."*

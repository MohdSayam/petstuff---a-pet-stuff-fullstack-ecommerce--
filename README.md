# PetStuff - Fullstack E-Commerce Platform 🐾

![PetStuff Banner](https://via.placeholder.com/1200x400?text=PetStuff+Banner+-+Screenshot+Here)

**PetStuff** is a modern, full-stack e-commerce application designed for pet owners. It features a seamless shopping experience, secure authentication, and a powerful admin dashboard for store management. Built with the **MERN Stack** (MongoDB, Express, React, Node.js), this project demonstrates scalable architecture and user-centric design.

---

## 🚀 Live Demo

- **Frontend**: [Link to Vercel Frontend Deployment]
- **Backend**: [Link to Vercel Backend Deployment]

*(Note: Replace these links after deployment!)*

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Responsive Design**: Mobile-first UI built with **Tailwind CSS**.
- **User Authentication**: Secure signup/login via Email & **Google OAuth**.
- **Product Discovery**: Search, filter, and view detailed product information.
- **Shopping Cart**: Real-time cart management with persistent state.
- **Order Management**: Track order status and view history.
- **Profile Management**: Update personal details and password securely.

> ![Screenshot of Home Page](https://via.placeholder.com/800x450?text=Screenshot+of+Home+Page)
> *Home Page displaying featured products*

### 🛡️ Admin Dashboard
- **Product Management**: Create, edit, and delete products with image uploads (**Cloudinary**).
- **Store Management**: Manage store details and settings.
- **Order Analytics**: Visualize sales data and order statuses.
- **Role-Based Access**: Secure admin-only routes and actions.

> ![Screenshot of Admin Dashboard](https://via.placeholder.com/800x450?text=Screenshot+of+Admin+Dashboard)
> *Admin Dashboard for managing store inventory*

---

## 🛠️ Tech Stack

### Frontend
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React.js** (Vite)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS**
- ![Redux](https://img.shields.io/badge/Context_API-000000?style=for-the-badge&logo=react&logoColor=white) **Context API** (State Management)
- **Axios** (API Integration)

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** & **Express.js**
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB** (Database)
- ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) **JWT** (Authentication)
- **Passport.js** (Google OAuth)
- **Cloudinary** (Image Storage)

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
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `FRONTEND_URL` | URL of the frontend (e.g., `http://localhost:5173` or Vercel URL) |

### Frontend (`/frontend/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Backend API URL (e.g., `http://localhost:8080/api` or Vercel URL) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Cluster

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/petstuff.git
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

## 👨‍💻 Author

**Mohd Sayam**  
- [GitHub Profile](https://github.com/Start-sys)
- [LinkedIn](#)

---

> *"Built with ❤️ and code."*

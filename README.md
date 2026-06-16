# ShopEZ - Effortless E-Commerce Platform

ShopEZ is a full-stack e-commerce application built using the **MERN (MongoDB, Express, React, Node.js) stack**. It features a modern, responsive design with a high-fidelity glassmorphism theme, interactive product catalogs, real-time inventory tracking, mock checkout, and a comprehensive seller analytics dashboard.

To make running this project extremely convenient, the backend is equipped with a **Dual-Database Fallback Mode**. If MongoDB is not running on your PC, the application will automatically save and load all accounts, products, and orders using local **JSON files** inside the `backend/data/` folder. **You do not need to install MongoDB to run the project!**

---

## Prerequisites

To run this application locally, you only need to download and install one tool:
1. **Node.js** (LTS Version): Download and install from the official site: [nodejs.org](https://nodejs.org/)

---

## Step-by-Step Running Instructions

Follow these simple steps once Node.js is installed on your PC:

### Step 1: Run the Backend Server
1. Open a terminal (Command Prompt, PowerShell, or Bash) and navigate to the project's `backend` folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *You should see a message saying: `⚠️ No MONGO_URI provided. Falling back to local JSON file database...` followed by `🚀 Server listening on port 5000`.*

### Step 2: Run the Frontend Server
1. Open a **new, separate terminal** and navigate to the project's `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Once started, open your web browser and navigate to the local link shown in the terminal:
   **[http://localhost:3000](http://localhost:3000)**

---

## Demo Credentials & Features

You can explore both sides of the e-commerce platform immediately using these setups:

### 💼 Seller Hub Account (Dashboard & Analytics)
We have pre-seeded the database with an official seller account. You can log in using:
- **Email:** `seller@shopez.com`
- **Password:** `seller123`

**Seller Features to Try:**
* **Analytics:** View interactive weekly revenue charts (powered by Recharts), total unit sales, active listings, and critical **low stock alerts**.
* **Inventory Control:** Create, edit, and delete products (with real-time updates in the customer view).
* **Order Fulfiller:** Update delivery states (e.g. ship pending items, mark as delivered) and see earnings rise immediately in your Analytics.

### 🛍️ Customer Experience
You can click **Register** on the auth page to create a customer account, or browse the store as a guest:
* **Search & Filters:** Search items instantly by keywords or click category pills.
* **Reviews:** View average ratings and read reviews. Customers can submit ratings (interactive stars) and custom comments.
* **Shopping Cart:** Add items to your cart, adjust quantities, and see your discount savings update live.
* **Mock Checkout:** Fill out shipping details and enter a dummy card number to simulate a secure transaction and view your confirmation receipt.

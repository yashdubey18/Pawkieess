# MongoDB Atlas Setup Guide for PAWKIESS

## Quick Setup (5 minutes)

### Step 1: Create Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google or email
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0) option
3. Select a cloud provider and region (closest to you)
4. Cluster Name: `pawkiess-cluster` (or keep default)
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left sidebar
2. Click "+ ADD NEW DATABASE USER"
3. Authentication Method: Password
4. Username: `pawkiess_admin`
5. Password: Click "Autogenerate Secure Password" and **COPY IT**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Allow Network Access
1. Click "Network Access" in left sidebar
2. Click "+ ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (for development)
   - CIDR: `0.0.0.0/0`
4. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://pawkiess_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT**: Replace `<password>` with your actual password from Step 3

### Step 6: Update Your Backend .env File
1. Open `backend/.env`
2. Replace the MONGODB_URI line:
   ```env
   MONGODB_URI=mongodb+srv://pawkiess_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/pawkiess?retryWrites=true&w=majority
   ```
   
   Note: Add `/pawkiess` before the `?` to specify the database name

### Step 7: Test Connection
1. Open terminal in `backend` folder
2. Run:
   ```bash
   npm run dev
   ```
3. You should see:
   ```
   MongoDB Connected: cluster0-xxxxx.mongodb.net
   Server running in development mode on port 5000
   ```

## ✅ Success!

Your MongoDB database is ready! You can now:
- View data in MongoDB Atlas web interface
- Use the database with your backend API
- Data is automatically backed up by MongoDB

## Viewing Your Data
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You'll see your databases and collections as you create data through the API

---

## Alternative: Local MongoDB (Windows)

If you prefer local installation:

1. Download MongoDB Community Server:
   - Visit: https://www.mongodb.com/try/download/community
   - Choose Windows version
   - Download and install

2. Start MongoDB:
   ```powershell
   # MongoDB should start automatically as a service
   # Check if running:
   net start MongoDB
   ```

3. Use this in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pawkiess
   ```

---

**Recommendation**: Use MongoDB Atlas for easier setup and automatic backups! ☁️

# MongoDB Connection Error - Fix Guide

## The Problem

You're seeing 500 errors when trying to login/register because MongoDB Atlas can't be reached. The error `ENOTFOUND ac-jbvuicn-shard-00-02.bca3uhu` means your computer can't find the MongoDB server.

## Common Causes & Solutions

### 1. **Internet Connection Issue**
- **Check**: Make sure you have internet connection
- **Test**: Try opening https://www.mongodb.com in your browser
- **Fix**: Reconnect to WiFi or check your network

### 2. **MongoDB Atlas IP Whitelist**
MongoDB Atlas blocks access from unknown IP addresses for security.

**Solution:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in to your account
3. Click **"Network Access"** in left sidebar
4. Check if your current IP is listed
5. If not, click **"+ ADD IP ADDRESS"**
6. Click **"ALLOW ACCESS FROM ANYWHERE"** (for development)
   - This sets IP to `0.0.0.0/0`
7. Click **"Confirm"**

### 3. **Incorrect MongoDB URI**
Check your `backend/.env` file:

```env
MONGODB_URI=mongodb+srv://yash:Yashdubey1511@cluster0.bca3uhu.mongodb.net/pawkiess?retryWrites=true&w=majority
```

Make sure:
- ✅ Username is correct (`yash`)
- ✅ Password is correct (`Yashdubey1511`)
- ✅ Cluster name matches (`cluster0.bca3uhu.mongodb.net`)
- ✅ No extra spaces or line breaks

### 4. **MongoDB Atlas Cluster Paused**
Free tier clusters pause after inactivity.

**Solution:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your cluster
3. If you see "Resume" button, click it
4. Wait 1-2 minutes for cluster to start

## What I've Changed

### 1. **Improved Database Connection** (`database.js`)
- Increased timeout to 10 seconds
- Added reconnection handling
- Better error messages in console

### 2. **Better Error Handling** (`authController.js`)
- Login/Register now show clear error messages
- Returns status 503 (Service Unavailable) for DB errors
- Error message: "Database connection error. Please check your internet connection"

## Testing the Fix

### Step 1: Restart Backend
1. In your backend terminal, press **Ctrl+C**
2. Run: `npm run dev`
3. Look for: `✅ MongoDB Connected: cluster0.bca3uhu.mongodb.net`

### Step 2: If You See Connection Error
The console will now show helpful tips:
```
❌ MongoDB Connection Error: getaddrinfo ENOTFOUND
⚠️  Server will run without database. Please check your MongoDB connection.
   Common fixes:
   1. Check your internet connection
   2. Verify MONGODB_URI in .env file
   3. Ensure MongoDB Atlas IP whitelist includes your IP
```

### Step 3: Test Login
1. Try to login through your app
2. If MongoDB is disconnected, you'll see a user-friendly error instead of generic "500 Internal Server Error"

## Quick Diagnostic

Run these checks:

**1. Internet Connection:**
```powershell
ping google.com
```

**2. MongoDB Reachable:**
```powershell
nslookup cluster0.bca3uhu.mongodb.net
```

**3. Check Backend Logs:**
Look for the `✅ MongoDB Connected` message when server starts

## Most Likely Fix

**The #1 most common issue is IP Whitelist.**

Your MongoDB Atlas is probably blocking your current IP address. Follow the IP whitelist steps above to allow access from anywhere (for development).

---

**After applying the fix, restart your backend and the login should work!** 🎉

# How to Enable AI Chatbot - GEMINI_API_KEY Configuration

## The Problem

The AI chatbot shows "Sorry, I encountered an error" because the `GEMINI_API_KEY` is missing from your `backend/.env` file.

## Solution

### Step 1: Get Your FREE Gemini API Key

1. **Visit**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. **Copy** the generated key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 2: Add API Key to Backend

Open the file: `backend/.env`

Add this line at the end (replace `YOUR_KEY_HERE` with your actual key):

```env
GEMINI_API_KEY=YOUR_KEY_HERE
```

**Example:**
```env
GEMINI_API_KEY=AIzaSyAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp
```

### Step 3: Restart Backend Server

1. In the terminal running your backend, press **Ctrl+C** to stop
2. Run `npm run dev` again to restart
3. The AI chatbot should now work!

## Your Current .env File Should Look Like This:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://yash:Yashdubey1511@cluster0.bca3uhu.mongodb.net/pawkiess?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=pawkiess_super_secret_jwt_key_2024

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google Gemini API Key
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

## Why This Happens

The backend code checks for `process.env.GEMINI_API_KEY` before making AI requests. If it's missing, it returns a 500 error with the message you're seeing.

## The Free Tier is Generous!

Google's Gemini API has a very generous free tier that's perfect for development and testing. You won't need to pay anything.

---

**Once you add the API key and restart the backend, the AI chatbot will work perfectly!** 🤖

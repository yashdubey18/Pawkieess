import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, location, petName, petBreed } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Auto-assign admin role for specific email
        let userRole = role || 'pet_owner';
        if (email === 'dyash1817@gmail.com') {
            userRole = 'admin';
        }

        // Create user with phone and location
        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
            phone,
            location: {
                address: location
            }
        });

        // If user is a pet owner and pet details are provided, create a pet record
        if (user && userRole === 'pet_owner' && petName && petBreed) {
            await Pet.create({
                owner: user._id,
                name: petName,
                breed: petBreed,
                species: 'dog' // Default to dog, can be updated later
            });
        }

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);

        // Check if it's a MongoDB connection error
        if (error.name === 'MongooseServerSelectionError' || error.message.includes('ENOTFOUND')) {
            res.status(503).json({
                message: 'Database connection error. Please check your internet connection and try again.',
                error: 'MongoDB connection failed'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);

        // Check if it's a MongoDB connection error
        if (error.name === 'MongooseServerSelectionError' || error.message.includes('ENOTFOUND')) {
            res.status(503).json({
                message: 'Database connection error. Please check your internet connection and try again.',
                error: 'MongoDB connection failed'
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            whatsapp: user.whatsapp,
            profilePicture: user.profilePicture,
            bio: user.bio,
            location: user.location,
            rating: user.rating,
            reviewCount: user.reviewCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

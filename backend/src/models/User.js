import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['pet_owner', 'pet_sitter', 'admin'],
        default: 'pet_owner'
    },
    // Location for matching
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        },
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    // Sitter Profile Data
    sitterProfile: {
        bio: {
            type: String,
            maxlength: [500, 'Bio can not be more than 500 characters']
        },
        experience: {
            type: String,
            default: 'New Sitter'
        },
        price: {
            type: Number,
            default: 0
        },
        services: [{
            type: String,
            enum: ['Dog Walking', 'Pet Sitting', 'House Sitting', 'Grooming', 'Drop-in Visits']
        }],
        availability: [{
            date: Date,
            isAvailable: {
                type: Boolean,
                default: true
            }
        }],
        isVerified: {
            type: Boolean,
            default: false
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        reviewsCount: {
            type: Number,
            default: 0
        }
    },
    // Contact Info
    phone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

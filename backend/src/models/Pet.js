import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide pet name'],
        trim: true
    },
    species: {
        type: String,
        required: [true, 'Please provide pet species'],
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
    },
    breed: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
        min: 0
    },
    weight: {
        type: Number,
        min: 0
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown'
    },
    photos: [{
        type: String
    }],
    medicalRecords: {
        vaccinations: [{
            name: String,
            date: Date,
            nextDue: Date
        }],
        allergies: [String],
        medications: [String],
        conditions: [String]
    },
    preferences: {
        diet: String,
        exerciseNeeds: String,
        socialBehavior: String,
        specialNeeds: [String]
    },
    microchipId: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    petOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petSitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    serviceType: {
        type: String,
        enum: ['Dog Walking', 'Pet Sitting', 'House Sitting', 'Grooming', 'Drop-in Visits'],
        required: true
    },
    notes: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    review: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
bookingSchema.index({ petOwner: 1, status: 1 });
bookingSchema.index({ petSitter: 1, status: 1 });

export default mongoose.model('Booking', bookingSchema);

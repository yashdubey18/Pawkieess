import Booking from '../models/Booking.js';
import User from '../models/User.js';

function sendMockSMS(phone, message) {
    if (phone) {
        console.log(`\n📱 [MOCK SMS ALERT]`);
        console.log(`   To: ${phone}`);
        console.log(`   Message: ${message}\n`);
    }
}

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { petSitter, pets, startDate, endDate, serviceType, totalPrice, notes } = req.body;

        const booking = await Booking.create({
            petOwner: req.user._id,
            petSitter,
            pets,
            startDate,
            endDate,
            serviceType,
            totalPrice,
            notes
        });

        // Mock SMS logic
        try {
            const sitter = await User.findById(petSitter).select('name phone');
            const owner = await User.findById(req.user._id).select('name');
            if (sitter && sitter.phone) {
                sendMockSMS(
                    sitter.phone, 
                    `Hi ${sitter.name}, you have a new ${serviceType} booking request from ${owner.name} for ${new Date(startDate).toLocaleDateString()}. Please check the app to confirm.`
                );
            }
        } catch (smsError) {
            console.error('Error sending mock SMS:', smsError);
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
    try {
        let query = {};

        // If user is pet sitter, get bookings where they are the sitter
        // If user is pet owner, get bookings where they are the owner
        if (req.user.role === 'pet_sitter') {
            query = { petSitter: req.user._id };
        } else {
            query = { petOwner: req.user._id };
        }

        const bookings = await Booking.find(query)
            .populate('petOwner', 'name email phone')
            .populate('petSitter', 'name email phone')
            .populate('pets', 'name species breed')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify user is authorized to update this booking
        if (booking.petSitter.toString() !== req.user._id.toString() &&
            booking.petOwner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

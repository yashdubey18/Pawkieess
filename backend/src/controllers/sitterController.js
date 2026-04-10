import User from '../models/User.js';

// @desc    Search for sitters
// @route   GET /api/sitters
// @access  Public
export const searchSitters = async (req, res) => {
    try {
        const { city, service, minPrice, maxPrice } = req.query;

        let query = {
            role: 'pet_sitter'
        };

        // Filter by location (city)
        if (city) {
            query['location.city'] = { $regex: city, $options: 'i' };
        }

        // Filter by service
        if (service) {
            query['sitterProfile.services'] = service;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query['sitterProfile.price'] = {};
            if (minPrice) query['sitterProfile.price'].$gte = Number(minPrice);
            if (maxPrice) query['sitterProfile.price'].$lte = Number(maxPrice);
        }

        const sitters = await User.find(query)
            .select('-password') // Exclude password
            .select('name email location sitterProfile phone'); // Select specific fields

        res.json(sitters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get sitter profile by ID
// @route   GET /api/sitters/:id
// @access  Public
export const getSitterProfile = async (req, res) => {
    try {
        const sitter = await User.findById(req.params.id).select('-password');

        if (!sitter || sitter.role !== 'pet_sitter') {
            return res.status(404).json({ message: 'Sitter not found' });
        }

        res.json(sitter);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Sitter not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

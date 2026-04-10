import Pet from '../models/Pet.js';

// @desc    Get all pets for logged in user
// @route   GET /api/pets
// @access  Private
export const getPets = async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.user._id });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
export const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('owner', 'name email');

        if (pet) {
            // Check if user owns this pet or is admin
            if (pet.owner._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
                res.json(pet);
            } else {
                res.status(403).json({ message: 'Not authorized to view this pet' });
            }
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
export const createPet = async (req, res) => {
    try {
        const pet = await Pet.create({
            ...req.body,
            owner: req.user._id
        });

        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
export const updatePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet) {
            if (pet.owner.toString() === req.user._id.toString()) {
                const updatedPet = await Pet.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true, runValidators: true }
                );
                res.json(updatedPet);
            } else {
                res.status(403).json({ message: 'Not authorized to update this pet' });
            }
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
export const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet) {
            if (pet.owner.toString() === req.user._id.toString()) {
                await Pet.findByIdAndDelete(req.params.id);
                res.json({ message: 'Pet removed' });
            } else {
                res.status(403).json({ message: 'Not authorized to delete this pet' });
            }
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

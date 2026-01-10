const express = require('express');
const Food = require('../models/Food');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');

const router = express.Router();

// GET API
// Get all available foods
router.get('/', async (req, res) => {
    try {
        const foods = await Food.find({ foodStatus: 'Available' }).sort({ createdAt: -1 });
        res.json({ ok: true, foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Failed to fetch foods" });
    }
});

// get my foods
router.get('/my', verifyFirebaseToken, async (req, res) => {
    try {
        const email = req.tokenEmail;
        const { status } = req.query;
        // Base filter: only user's foods
        const filter = { email };
        // Optional status filter
        if (status) {
            filter.foodStatus = status; // 'Available' | 'Unavailable'
        }
        const foods = await Food.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            ok: true,
            foods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Failed to fetch user foods'
        });
    }
});

// featured foods : Top 6 foods by quantity (high → low)
router.get('/featured', async (req, res) => {
    try {
        const featuredFoods = await Food.find({ foodStatus: 'Available' })
            .sort({ foodQuantity: -1 })
            .limit(6)
            .select('-__v');

        res.json({
            success: true,
            count: featuredFoods.length,
            foods: featuredFoods
        });
    } catch (error) {
        console.error('Featured food error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load featured foods'
        });
    }
});

// Get food by ID
router.get('/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).select('-__v -createdAt');
        if (!food) return res.status(404).json({ ok: false, message: "Food not found" });
        res.json({ status: true, food });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Failed to fetch food" });
    }
});


// POST API
// create a food
router.post('/', verifyFirebaseToken, async (req, res) => {
    try {
        const { donator, email, donatorPhoto, foodName, foodQuantity, pickupLocation, expireDate, notes, imageUrl, foodStatus } = req.body;

        // check if food already exists (same name + donator + expireDate)
        const existingFood = await Food.findOne({ foodName, email, expireDate });
        if (existingFood) return res.status(400).json(
            { ok: false, message: "Food already exists" }
        );

        const newFood = await Food.create({
            donator, email, donatorPhoto, foodName, foodQuantity, pickupLocation, expireDate, notes, imageUrl, foodStatus
        });

        res.status(201).json({
            ok: true,
            message: "Food added successfully",
            insertedId: newFood._id
        });
    } catch (error) {
        console.error("Add food error:", error);
        res.status(500).json({ ok: false, message: "Failed to add food" });
    }
});

// Update API
// Update a food
router.patch('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        // Find food
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({
                success: false, message: 'Food not found'
            });
        }

        // Authorization check
        if (food.email !== req.tokenEmail) {
            return res.status(403).json({
                success: false, message: 'Forbidden access'
            });
        }

        const { foodName, foodQuantity, pickupLocation, expireDate, notes, imageUrl, foodStatus } = req.body;
        const updates = {};
        // check which field need updates
        if (foodName !== undefined) updates.foodName = foodName;
        if (foodQuantity !== undefined) updates.foodQuantity = foodQuantity;
        if (pickupLocation !== undefined) updates.pickupLocation = pickupLocation;
        if (expireDate !== undefined) updates.expireDate = expireDate;
        if (notes !== undefined) updates.notes = notes;
        if (imageUrl !== undefined) updates.imageUrl = imageUrl;
        if (foodStatus !== undefined) updates.foodStatus = foodStatus;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false, message: 'No valid fields provided for update'
            });
        }

        // Apply updates
        Object.assign(food, updates);
        await food.save();

        res.status(200).json({
            success: true, message: 'Food updated successfully', data: food
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false, message: error.message
        });
    }
});

// DELETE API
// Delete a food
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const email = req.query.email;
        if (email !== req.tokenEmail) {
            return res.status(403).json({ success: false, message: 'Forbidden access' });
        }

        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }

        // check if the current user is the owner
        if (food.email !== req.tokenEmail) {
            return res.status(403).json({ success: false, message: 'You can only delete your own food' });
        }

        // Delete the food
        await Food.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true, message: 'Food deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete food' });
    }
});


module.exports = router;
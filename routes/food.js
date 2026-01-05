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
        const food = await Food.findById(req.params.id);
        if(!food) return res.status(404).json({ ok: false, message: "Food not found" });
        res.json({ ok: true, food });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Failed to fetch food" });
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


module.exports = router;
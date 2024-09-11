const mongoose = require('mongoose');

// Define the Cart schema
const cartSchema = mongoose.Schema({
    image: { 
        type: String, 
     },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// Export the Cart model
const cartData = mongoose.model('Cart', cartSchema);
module.exports = cartData;

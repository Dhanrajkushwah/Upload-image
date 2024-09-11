const manageUserModel = require("../models/user.model");
const manageCartModel = require("../models/cart.model");
const manageContactModel = require("../models/contact.model");

const status = require("../config/status");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Ensure the folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Name the file with timestamp
    }
});

const fileFilter = (req, file, cb) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif','image/webp'];
    const ext = path.extname(file.originalname).toLowerCase();
  
    // Validate MIME type and file extension
    if (validMimeTypes.includes(file.mimetype) && (ext === '.jpeg' || ext === '.jpg' || ext === '.png' || ext === '.gif'|| ext === '.webp')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only JPEG, PNG, and GIF are allowed.'));
    }
  };

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Upload file and create cart
exports.uploadFile = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ message: 'File upload error', error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imagePath = `/uploads/${req.file.filename}`; // Generate URL for image access

        const newCart = new manageCartModel({
            image: imagePath, // Save the image path in the database
        });

        try {
            await newCart.save();
            res.json({ success: true, message: 'Image uploaded successfully', cart: newCart });
        } catch (err) {
            console.error('Error saving cart to database:', err);
            res.status(500).json({ message: 'Error saving cart to database', error: err.message });
        }
    });
};




// Get all users
exports.list = async (req, res) => {
    try {
        const data = await manageUserModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Notes failed.' });
    }
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, birthdate, gender, phoneNumber } = req.body;

    try {
        const userExists = await manageUserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await manageUserModel.create({
            firstName,
            lastName,
            email,
            password,
            birthdate,
            gender,
            phoneNumber,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Cart with image upload
exports.createCart = [
    upload.single('image'), // Handle the image upload
    async (req, res) => {
        try {
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

            const newCart = new manageCartModel({
                imageUrl
            });

            await newCart.save();
            res.json({ success: true, status: status.OK, msg: 'Adding image is successful.' });
        } catch (err) {
            console.log("Error creating cart:", err);
            return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding image failed.' });
        }
    }
];

// Get all Cart
exports.listCart = async (req, res) => {
    try {
        const data = await manageCartModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching carts:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get carts failed.' });
    }
};

//Create Contact 
exports.createcontact = async (req, res) => {
    try {
        var obj = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
        }
        const newmanageContactModel = new manageContactModel(obj);
        let result = await newmanageContactModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Contact is successfully.' });

    }
    catch (err) {
        console.log("err", err)
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Contact failed.' });

    }
}

// Get all Contact
exports.listContact = async (req, res) => {
    try {
        const data = await manageContactModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching Contact:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Contact failed.' });
    }
};
// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await manageUserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            _id: user._id,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

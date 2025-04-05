const User = require('../models/userModel');

// Register a user => /api/v1/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userData = {
      name,
      email,
      password,
    };

    // Only set role if it's provided
    if (role) {
      userData.role = role;
    }

    const user = await User.create(userData);

    // Create JWT Token
    const token = user.getJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user => /api/v1/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password is entered by user
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email & password',
      });
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email or Password',
      });
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email or Password',
      });
    }

    // Create JWT Token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout user => /api/v1/logout
exports.logout = async (req, res) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update / Change password => /api/v1/password/update
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    user.password = req.body.password;
    await user.save();

    // Create JWT Token
    const token = user.getJwtToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile => /api/v1/me/update
exports.updateProfile = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin Routes

// Get all users => /api/v1/admin/users
exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile => /api/v1/admin/user/:id
exports.updateUser = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`,
      });
    }

    // Remove user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

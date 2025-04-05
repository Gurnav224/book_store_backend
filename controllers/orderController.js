const Order = require('../models/orderModel');
const Book = require('../models/bookModel');

// Create a new order => /api/v1/order/new
exports.newOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single order => /api/v1/order/:id
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No Order found with this ID',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders - ADMIN => /api/v1/admin/orders
exports.allOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update / Process order - ADMIN => /api/v1/admin/order/:id
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No Order found with this ID',
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'You have already delivered this order',
      });
    }

    // Update book stock for each order item
    for (const item of order.orderItems) {
      await updateStock(item.book, item.quantity);
    }

    order.orderStatus = req.body.status;
    
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

async function updateStock(id, quantity) {
  const book = await Book.findById(id);
  book.stock = book.stock - quantity;
  await book.save({ validateBeforeSave: false });
}

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No Order found with this ID',
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

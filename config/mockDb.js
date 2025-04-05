// Mock database service for when MongoDB is not available
class MockDatabase {
  constructor() {
    this.users = [];
    this.books = [];
    this.orders = [];
    this.nextUserId = 1;
    this.nextBookId = 1;
    this.nextOrderId = 1;
    
    // Add a default admin user
    this.users.push({
      _id: this.getNextUserId(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2a$10$rkL8RLrqKXCAXVCfHPHNxeEEJqW3OxjYLgpH9QCJBeoL/TgJOSrIS', // hashed 'admin123'
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  getNextUserId() {
    return `user_${this.nextUserId++}`;
  }

  getNextBookId() {
    return `book_${this.nextBookId++}`;
  }

  getNextOrderId() {
    return `order_${this.nextOrderId++}`;
  }

  // User methods
  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  async createUser(userData) {
    const user = {
      _id: this.getNextUserId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id, userData) {
    const index = this.users.findIndex(user => user._id === id);
    if (index === -1) return null;
    
    this.users[index] = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date()
    };
    
    return this.users[index];
  }

  async deleteUser(id) {
    const index = this.users.findIndex(user => user._id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }

  async getAllUsers() {
    return this.users;
  }

  // Book methods
  async createBook(bookData) {
    const book = {
      _id: this.getNextBookId(),
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.books.push(book);
    return book;
  }

  async findBookById(id) {
    return this.books.find(book => book._id === id);
  }

  async updateBook(id, bookData) {
    const index = this.books.findIndex(book => book._id === id);
    if (index === -1) return null;
    
    this.books[index] = {
      ...this.books[index],
      ...bookData,
      updatedAt: new Date()
    };
    
    return this.books[index];
  }

  async deleteBook(id) {
    const index = this.books.findIndex(book => book._id === id);
    if (index === -1) return false;
    
    this.books.splice(index, 1);
    return true;
  }

  async getAllBooks() {
    return this.books;
  }

  // Order methods
  async createOrder(orderData) {
    const order = {
      _id: this.getNextOrderId(),
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(order);
    return order;
  }

  async findOrderById(id) {
    return this.orders.find(order => order._id === id);
  }

  async updateOrder(id, orderData) {
    const index = this.orders.findIndex(order => order._id === id);
    if (index === -1) return null;
    
    this.orders[index] = {
      ...this.orders[index],
      ...orderData,
      updatedAt: new Date()
    };
    
    return this.orders[index];
  }

  async deleteOrder(id) {
    const index = this.orders.findIndex(order => order._id === id);
    if (index === -1) return false;
    
    this.orders.splice(index, 1);
    return true;
  }

  async getAllOrders() {
    return this.orders;
  }

  async getUserOrders(userId) {
    return this.orders.filter(order => order.user === userId);
  }
}

module.exports = new MockDatabase();

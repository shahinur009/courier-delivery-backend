const { ObjectId } = require('mongodb');
const client = require('../config/db');

const usersCollection = client.db('courierApp').collection('users');

class User {
  constructor(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'customer';
    this.phone = userData.phone;
    this.address = userData.address;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static async create(userData) {
    const user = new User(userData);
    const result = await usersCollection.insertOne(user);
    return result;
  }

  static async findByEmail(email) {
    return await usersCollection.findOne({ email });
  }

  static async findById(id) {
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  }

  static async updateUser(id, updateData) {
    updateData.updatedAt = new Date();
    return await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async getAllUsers() {
    return await usersCollection.find().toArray();
  }
}

module.exports = User;
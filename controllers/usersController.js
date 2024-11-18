const { ObjectId } = require('mongodb');
const client = require('../config/db');

const usersCollection = client.db('usersCollection').collection('users');

const getUsers = async (req, res) => {
  try {
    const { email } = req.query;
    const result = await usersCollection.find({ email: { $ne: email } }).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching users' });
  }
};

module.exports = { getUsers };

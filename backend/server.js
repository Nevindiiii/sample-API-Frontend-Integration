const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'DummyJson';

app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB first, then start server
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// -------------------- CRUD USERS -------------------- //

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json({ users, total: users.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users', toast: { type: 'error', message: 'Failed to fetch users' } });
  }
});

// Add user
app.post('/api/users', async (req, res) => {
  console.log('POST /api/users called with body:', req.body); // Debug
  try {
    const result = await db.collection('users').insertOne(req.body);
    const user = { ...req.body, _id: result.insertedId };
    res.json({ user, toast: { type: 'success', message: `User "${req.body.name}" added successfully` } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add user', toast: { type: 'error', message: 'Failed to add user' } });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    await db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    const user = { ...req.body, _id: req.params.id };
    res.json({ user, toast: { type: 'success', message: `User "${req.body.name}" updated successfully` } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user', toast: { type: 'error', message: 'Failed to update user' } });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    console.log('DELETE request for user ID:', req.params.id);
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(req.params.id) });
    console.log('Delete result:', result);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found', toast: { type: 'error', message: 'User not found' } });
    }
    res.json({ message: 'User deleted', toast: { type: 'success', message: `User "${user?.name || 'User'}" deleted successfully` } });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message, toast: { type: 'error', message: 'Failed to delete user' } });
  }
});

// -------------------- CRUD NOTIFICATIONS -------------------- //

// Fetch all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await db.collection('notifications').find().sort({ timestamp: -1 }).toArray();
    res.json({ notifications, total: notifications.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications', toast: { type: 'error', message: 'Failed to fetch notifications' } });
  }
});

// Add notification
app.post('/api/notifications', async (req, res) => {
  try {
    const result = await db.collection('notifications').insertOne(req.body);
    const notification = { ...req.body, _id: result.insertedId };
    res.json({ notification, toast: { type: 'success', message: 'Notification added successfully' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add notification', toast: { type: 'error', message: 'Failed to add notification' } });
  }
});

// Update notification (mark as read)
app.put('/api/notifications/:id', async (req, res) => {
  try {
    await db.collection('notifications').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    const notification = { ...req.body, _id: req.params.id };
    res.json({ notification, toast: { type: 'success', message: 'Notification updated successfully' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notification', toast: { type: 'error', message: 'Failed to update notification' } });
  }
});

// Delete notification
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Notification not found', toast: { type: 'error', message: 'Notification not found' } });
    }
    res.json({ message: 'Notification deleted', toast: { type: 'success', message: 'Notification deleted successfully' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete notification', toast: { type: 'error', message: 'Failed to delete notification' } });
  }
});

// Clear all notifications
app.delete('/api/notifications', async (req, res) => {
  try {
    const result = await db.collection('notifications').deleteMany({});
    res.json({ message: 'All notifications cleared', toast: { type: 'success', message: `${result.deletedCount} notifications cleared successfully` } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear notifications', toast: { type: 'error', message: 'Failed to clear notifications' } });
  }
});



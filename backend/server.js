const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load environment variables from .env
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// 4. Connect to MongoDB Atlas with Diagnostics
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const db = mongoose.connection.db;
    console.log('\n===========================================');
    console.log(`📡 Connected to Database: [ ${db.databaseName} ]`);

    // List all collections in this connected database
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    console.log('📂 Collections found in DB:', collectionNames);

    // Check count in 'events' collection
    if (collectionNames.includes('events')) {
      const count = await db.collection('events').countDocuments();
      console.log(`📊 Documents inside 'events': ${count}`);
    } else {
      console.log("⚠️ WARNING: No collection named 'events' found here!");
    }
    console.log('===========================================\n');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gift = require('./models/Gift');

// Load environment variables
dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_scrapbook';

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for seeding.');

    // Clear existing data to avoid duplicates
    await Gift.deleteMany({});
    console.log('🧹 Cleared existing Gift data.');

    // Sample data from the reference video
    const sampleGift = new Gift({
      passcode: '0411',
      recipientName: 'Nimnadhi Manamperi',
      letterText: "Distance isn't easy, but loving you makes it worth every smile. I miss the little things—your voice, your laughter, just being near you—but I hold onto us and everything we're building together. No matter how far apart we are, you're still my safe place, my favorite person, and the one I choose every day. Just a little longer, okay? I'm always yours. ❤️",
      mediaUrls: [
        '/assets/memory1.jpg',
        '/assets/memory2.jpg',
        '/assets/memory3.jpg',
        '/assets/memory4.jpg',
        '/assets/memory5.jpg',
        '/assets/memory6.jpg',
        '/assets/memory7.jpg',
        '/assets/memory8.jpg',
        '/assets/memory9.jpg'
      ]
    });

    await sampleGift.save();
    console.log('🎉 Successfully seeded one sample Gift!');
    console.log('Data details:');
    console.log(JSON.stringify(sampleGift, null, 2));

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

seedDatabase();

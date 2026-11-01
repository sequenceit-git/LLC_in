require('./src/config/env');
const mongoose = require('mongoose');
const AdminUser = require('./src/models/AdminUser');

const USERNAME = 'kaziranausa';
const PASSWORD = '!Admin@Rana505';

async function seedAdmin() {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error('Missing DB_URI in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to database for admin user seed...');

    const hashedPassword = await AdminUser.hashPassword(PASSWORD);

    const updated = await AdminUser.findOneAndUpdate(
      { username: USERNAME.toLowerCase() },
      {
        $set: {
          username: USERNAME.toLowerCase(),
          password: hashedPassword,
          role: 'admin',
        },
      },
      { upsert: true, new: true }
    );

    console.log(`✓ Admin user successfully seeded with bcrypt hash:`);
    console.log(`  ID: ${updated._id}`);
    console.log(`  Username: ${updated.username}`);
    console.log(`  Role: ${updated.role}`);
    console.log(`  Bcrypt Hash: ${updated.password.substring(0, 15)}...`);

    const isMatch = await updated.comparePassword(PASSWORD);
    console.log(`  Verification test with '!Admin@Rana505': ${isMatch ? 'PASSED ✓' : 'FAILED ✗'}`);

    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
}

seedAdmin();

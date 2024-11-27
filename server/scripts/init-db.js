import sequelize from '../config/database.js';
import { User, Organization, OrganizationMember } from '../models/index.js';

async function initializeDatabase() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Drop existing tables and recreate
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');

    // Create system admin if not exists
    const adminEmail = 'acc.farouk@yahoo.com';
    const admin = await User.findOne({ where: { email: adminEmail } });

    if (!admin) {
      await User.create({
        email: adminEmail,
        nameEn: 'System Admin',
        nameAr: 'مدير النظام',
        role: 'SYSTEM_ADMIN',
        profileCompletion: 100
      });
      console.log('System admin created successfully.');
    }

    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
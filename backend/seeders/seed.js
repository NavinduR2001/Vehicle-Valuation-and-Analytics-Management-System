require('dotenv').config();
const { sequelize, User, Company } = require('../models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    // Seed insurance companies
    const companies = [
      { name: "People's Insurance PLC", contactNo: '0112 337 337', address: 'Colombo 03, Sri Lanka', valuationFee: 1000 },
      { name: 'AIA Insurance Lanka PLC', contactNo: '0112 310 310', address: 'Colombo 02, Sri Lanka', valuationFee: 1200 },
      { name: 'Ceylinco General Insurance', contactNo: '0112 330 500', address: 'Colombo 01, Sri Lanka', valuationFee: 1500 },
      { name: 'Allianz Insurance Lanka', contactNo: '0112 344 900', address: 'Colombo 03, Sri Lanka', valuationFee: 1000 },
      { name: 'Union Assurance PLC', contactNo: '0112 686 345', address: 'Colombo 02, Sri Lanka', valuationFee: 1000 },
      { name: 'Sri Lanka Insurance Corporation', contactNo: '0112 357 357', address: 'Colombo 02, Sri Lanka', valuationFee: 1100 },
      { name: 'Janashakthi Insurance PLC', contactNo: '0112 429 100', address: 'Colombo 05, Sri Lanka', valuationFee: 900 },
      { name: 'HNB General Insurance', contactNo: '0115 367 367', address: 'Colombo 07, Sri Lanka', valuationFee: 1000 },
    ];

    for (const comp of companies) {
      await Company.findOrCreate({ where: { name: comp.name }, defaults: comp });
    }
    console.log('✅ Companies seeded');

    // Seed admin
    const adminCompany = await Company.findOne();
    const [admin, created] = await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL || 'admin@valuation.com' },
      defaults: {
        firstName: 'System',
        lastName: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@valuation.com',
        phone: '0771234567',
        idCardNumber: 'ADMIN001',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'ADMIN',
        // Admins are not associated with a company
        isActive: true,
      },
    });

    if (created) {
      console.log('✅ Admin user seeded:', admin.email);
    } else {
      console.log('ℹ️  Admin already exists:', admin.email);
    }

    // Seed a sample manager
    const [manager, managerCreated] = await User.findOrCreate({
      where: { email: 'manager@valuation.com' },
      defaults: {
        firstName: 'John',
        lastName: 'Manager',
        email: 'manager@valuation.com',
        phone: '0779876543',
        idCardNumber: 'MGR001',
        password: 'Manager@123',
        role: 'MANAGER',
        // Managers are not associated with a company
        isActive: true,
      },
    });
    if (managerCreated) console.log('✅ Sample manager seeded');

    // Seed a sample user
    const [user, userCreated] = await User.findOrCreate({
      where: { email: 'user@valuation.com' },
      defaults: {
        firstName: 'Jane',
        lastName: 'User',
        email: 'user@valuation.com',
        phone: '0771112233',
        idCardNumber: 'USR001',
        password: 'User@123',
        role: 'USER',
        companyId: adminCompany ? adminCompany.id : null,
        isActive: true,
      },
    });
    if (userCreated) console.log('✅ Sample user seeded');

    console.log('\n🚀 Database seeded successfully!');
    console.log('-----------------------------------');
    console.log('Admin:   admin@valuation.com / Admin@123');
    console.log('Manager: manager@valuation.com / Manager@123');
    console.log('User:    user@valuation.com / User@123');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {``
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();

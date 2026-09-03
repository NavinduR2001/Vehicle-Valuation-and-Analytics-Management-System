require('dotenv').config();
const { sequelize, Company, Valuation } = require('./models');

const updateDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // 1. Backfill valuationFee on companies
    const companies = await Company.findAll();
    for (const company of companies) {
      if (company.valuationFee === null || company.valuationFee === undefined) {
        await company.update({ valuationFee: 1000 });
        console.log(`✅ Updated company ${company.name} with valuationFee 1000`);
      }
    }

    // 2. Backfill revenueFee on existing ADMIN_APPROVED valuations
    const valuations = await Valuation.findAll({ where: { status: 'ADMIN_APPROVED' } });
    for (const val of valuations) {
      if (val.revenueFee === null || val.revenueFee === undefined) {
        await val.update({ revenueFee: 1000 });
        console.log(`✅ Updated valuation ${val.id} with revenueFee 1000`);
      }
    }

    console.log('🎉 Database backfill complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateDatabase();

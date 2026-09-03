const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Vehicle = require('./Vehicle');
const Valuation = require('./Valuation');
const Report = require('./Report');

// Company <-> User (Employee)
Company.hasMany(User, { foreignKey: 'companyId', as: 'employees' });
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// User -> Vehicles
User.hasMany(Vehicle, { foreignKey: 'userId', as: 'vehicles' });
Vehicle.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Vehicle -> Valuations
Vehicle.hasMany(Valuation, { foreignKey: 'vehicleId', as: 'valuations' });
Valuation.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

// User -> Valuations (submitted by)
User.hasMany(Valuation, { foreignKey: 'userId', as: 'submittedValuations' });
Valuation.belongsTo(User, { foreignKey: 'userId', as: 'submittedBy' });

// User (Manager) -> Valuations
User.hasMany(Valuation, { foreignKey: 'managerId', as: 'managedValuations' });
Valuation.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

// User (Admin) -> Valuations
User.hasMany(Valuation, { foreignKey: 'adminId', as: 'approvedValuations' });
Valuation.belongsTo(User, { foreignKey: 'adminId', as: 'approvedByAdmin' });

// Valuation -> Report
Valuation.hasOne(Report, { foreignKey: 'valuationId', as: 'report' });
Report.belongsTo(Valuation, { foreignKey: 'valuationId', as: 'valuation' });

// User (Admin) -> Reports
User.hasMany(Report, { foreignKey: 'adminId', as: 'generatedReports' });
Report.belongsTo(User, { foreignKey: 'adminId', as: 'generatedBy' });

module.exports = { sequelize, User, Company, Vehicle, Valuation, Report };

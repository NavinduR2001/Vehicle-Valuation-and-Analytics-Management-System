const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Valuation = sequelize.define('Valuation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehicles', key: 'id' },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'MANAGER_APPROVED', 'ADMIN_APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  valuationPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Market value assessed by the manager',
  },
  revenueFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null,
    comment: 'Revenue fee charged (from company.valuationFee) at time of Admin approval',
  },
  managerNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  managerInspectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  adminApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'valuations',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['managerId'] },
    { fields: ['status'] },
    { fields: ['vehicleId'] },
  ],
});

module.exports = Valuation;

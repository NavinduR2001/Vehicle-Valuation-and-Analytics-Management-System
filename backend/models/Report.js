const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reportId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Human-readable report ID like VVS-2024-001',
  },
  valuationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'valuations', key: 'id' },
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  filePath: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'PDF file path on disk',
  },
  generatedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
}, {
  tableName: 'reports',
  timestamps: true,
  indexes: [
    { fields: ['valuationId'] },
    { fields: ['reportId'] },
  ],
});

module.exports = Report;

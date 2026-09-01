const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  registrationNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  assetType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  make: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  engineNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  chassisNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  inspectionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  inspectionPlace: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'N/A',
  },
  firstRegistrationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  yearOfManufacture: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  engineCC: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  fuelType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Petrol',
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of image file paths',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'vehicles',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['registrationNo'] },
  ],
});

module.exports = Vehicle;

module.exports = (sequelize, DataTypes) => {
  const company = sequelize.define('company', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: (models) => {
      },
    },
  });
  return company;
};

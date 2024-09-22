module.exports = (sequelize, Sequelize, Role) => {

    console.log("inside usermodel.js module.exports")

    const User = sequelize.define("users", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        surname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        role: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: 1,
          references: {
              model: Role,
              key: 'id'
          }
        },
        access_token: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password_token: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      });
  
return User;
};
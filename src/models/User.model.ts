import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class User extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public varificationToken!: string | null;
  public verificationTokenExpiresAt!: Date | null;
  public resetPasswordToken!: string | null;
  public resetPasswordTokenExpiresAt!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    varificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { sequelize, tableName: "users" }
);

export default User;

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Blog extends Model {
  public title!: string;
  public subtitle!: string;
  public slug!: string;
  public thumbnail!: string;
  public categories!: string;
  public content!: string;
  public author!: string;
  public status!: string;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedBy!: number;
  public updatedAt!: Date;
  public publishDateAndTime!: Date;
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categories: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "draft",
      validate: {
        isIn: [["draft", "published", "archived"]],
        notEmpty: true,
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    publishDateAndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, tableName: "blogs" }
);

export default Blog;

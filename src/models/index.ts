import sequelize from "../config/database.js";
import User from "./User.model.js";
import Blog from "./Blog.model.js";

// // Associations
// User.hasMany(Blog, { foreignKey: "authorId" });
// Blog.belongsTo(User, { foreignKey: "authorId" });

export { sequelize, User, Blog };

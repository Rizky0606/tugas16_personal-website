"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      author: DataTypes.STRING,
      image: DataTypes.STRING,
      duration: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      postAt: DataTypes.DATE,
      fullTime: DataTypes.STRING,
      technologies: DataTypes.ARRAY,
    },
    {
      sequelize,
      modelName: "Blogs",
    }
  );
  return Blog;
};

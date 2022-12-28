module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("books", {
      title: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.STRING
      },
      author: {
        type: DataTypes.STRING
      },
    
    });
  
    return Book;
  };
const db = require("../models");
const Book = db.book;
const Op = db.DataTypes.Op;

// Create and Save a new Book
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    return res.status(400).send({
      msg: "opss...!!!"
    });
  }

  try {
    // Create a book
    const book = {
      title: req.body.title,
      price: req.body.price,
      author: req.body.author
    };

    // Save book in database
    const savedBook = await Book.create(book);
    res.send(savedBook);
  } catch (err) {
    res.status(500).send({
      msg: err.message || "Some error occurred while creating the Book"
    });
  }
};

// Retrieve all Books from the database.
exports.findAll = async (req, res) => {
  const title = req.query.title;
  const condition = title
    ? {
        title: {
          [Op.iLike]: `%${title}%`
        }
      }
    : null;

  try {
    const books = await Book.findAll({ where: condition });
    res.send(books);
  } catch (err) {
    res.status(500).send({
      msg: err.message || "Some error occurred while retrieving books."
    });
  }
};

// Find a single Book with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).send({
        msg: `Cannot find Book with id=${id}.`
      });
    }
    res.send(book);
  } catch (err) {
    res.status(500).send({
      msg: "Error retrieving Book with id=" + id
    });
  }
};

// Update a Book by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await Book.update(req.body, {
      where: {
        id: id
      }
    });
    if (num[0] === 0) {
      return res.send({
        msg: `Cannot update Book with id=${id}. Maybe Book was not found or req.body is empty!`
      });
    }
    res.send({
      msg: "Book was updated successfully."
    });
  } catch (err) {
    res.status(500).send({
      msg: "Error updating Book with id = " + id
    });
  }
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Book.destroy({ where: { id } })
      .then((num) => {
        if (num === 0) {
          return res.status(404).send({
            msg: `Cannot delete Book with id=${id}. Maybe Book was not found!`,
          });
        }
        res.send({
          msg: "Book was deleted successfully!",
        });
      })
      .catch((err) => {
        res.status(500).send({
          msg: `Error deleting Book with id=${id}`,
        });
      });
  };
  
  // Delete all Books from the database.
  exports.deleteAll = (req, res) => {
    Book.destroy({ where: {}, truncate: false })
      .then((nums) => {
        res.send({ msg: `${nums} Books were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          msg: "Error deleting all Books",
        });
      });
  };
  
 
const { authJwt } = require("../middleware")

const books = require('../controllers/book.controller')


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    //Create New Book 
    app.post('/api/books',   [authJwt.verifyToken], books.create)

    //Retrieve all books 
    app.get('/api/books',    [authJwt.verifyToken],books.findAll)

    // Retrieve a single Book by id
    app.get("/api/books/:id",    [authJwt.verifyToken],books.findOne);
    
    // Update a book by id
    app.put('/api/books/:id',   [authJwt.verifyToken],books.update)

    //Delete a book by id
    app.delete('/api/books/:id',   [authJwt.verifyToken],books.delete)
    
    //Delete All Books
    app.delete("/api/books",   [authJwt.verifyToken] ,books.deleteAll)
}
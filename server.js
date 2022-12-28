const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

//create 3 rows in the db 
function initial(){
  Role.create({
    id:1,
    name : "user"
  });
  Role.create({
    id:2,
    name:"moderator"
  });
  Role.create({
    id:3,
    name:"admin"
  })
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require("./app/routes/book.routes")(app);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to book application." });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

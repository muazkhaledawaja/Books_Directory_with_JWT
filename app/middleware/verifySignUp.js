const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Check Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Oopss Username is already in use!"
      });
      return;
    }

    //Check Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Oopss Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};


checkRolesExisted = (req,res,next)=>{
    if(req.body.roles){
        for(let i = 0;i < req.body.roles.lenght;i++){
            if(!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    msg: "Failed! Role does not exist = " + req.body.roles[i]
                })
                return
            }
        }
    }
    next()
}


const verifySignUp ={
    checkDuplicateUsernameOrEmail : checkDuplicateUsernameOrEmail,
    checkRolesExisted : checkRolesExisted
}

module.exports = verifySignUp;
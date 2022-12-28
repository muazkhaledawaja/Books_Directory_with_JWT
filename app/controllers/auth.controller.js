const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.DataTypes.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const user = await User.create({ username, email, password: bcrypt.hashSync(password, 8) });

    if (roles) {
      const rolesToAssign = await Role.findAll({
        where: {
          name: {
            [Op.or]: roles,
          },
        },
      });
      await user.setRoles(rolesToAssign);
    } else {
      // user role = 1
      await user.setRoles([1]);
    }

    res.send({ msg: "User was registered successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).send({ msg: "User Not Found :(" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        msg: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });
    const roles = await user.getRoles();
    const authorities = roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

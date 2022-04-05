const express = require("express");
const router = express.Router();
const userModel = require("../models").User;
router.get("/", (req, res) => {
  userModel.findAll().then(
    (users) => {
      res.status(200).json(users);
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});
router.post("/", (req, res) => {
  const { username, password, date_of_creation } = req.body;
  userModel.findOne({ where: { username } }).then(
    (user) => {
      if (user) {
        res.json({ status: 0, debug_data: "User Already Exists" });
      } else {
        userModel
          .create({ username, password, date_of_creation })
          .then((user) => {
            res.json({ status: 1, data: "User Created Successfully" });
          });
      }
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});
router.get("/:username", (req, res) => {
  userModel.findOne({ where: { username: req.params.username } }).then(
    (user) => {
      if (user) {
        res.json({ status: 1, data: user });
      } else {
        res.json({ status: 0, data: "User  Not Found" });
      }
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});
router.delete("/delete/:username", (req, res) => {
  userModel.destroy({ where: { username: req.params.username } }).then(
    (user) => {
      res.status(200).json(`${req.params.username} user is deleted`);
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});
router.put("/:username", (req, res) => {
  const { username, password, date_of_creation } = req.body;
  userModel.findOne({ where: { username: req.params.username } }).then(
    (User) => {
      if (User) {
        userModel
          .update(
            { username, password, date_of_creation },
            { where: { username: req.params.username } }
          )
          .then((user) => {
            res.json({ status: 1, data: "User Details Updated Successfully" });
          });
      } else {
        res.json({ status: 0, data: "User  Not Found" });
      }
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});
router.post("/checklogin", function (req, res) {
  userModel
    .findOne({
      where: { username: req.body.username, password: req.body.password },
    })
    .then(function (User) {
      if (User) {
        req.session["username"] = req.body.username;
        console.log(req.session.username);
        req.session["isLoggedIn"] = 1;
        console.log(req.session.isLoggedIn);
        res.json({ status: 1, data: req.body.username });
      } else {
        req.session["isLoggedIn"] = 0;
        console.log(req.session.isLoggedIn);
        res.json({ status: 0, data: "Incorrect Login Details" });
      }
    });
});
router.get("/login/loginuser", function (req, res) {
  if (req.session.isLoggedIn) {
    userModel
      .findOne({
        where: { username: req.session.username },
      })
      .then((user) => {
        res.status(200).json({ userdetails: user });
      });
  } else {
    res.json({ status: 0, data: "You are not logged In" });
  }
});
module.exports = router;

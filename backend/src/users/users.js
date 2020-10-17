const express = require("express");
const router = express.Router();

const UserModel = require('../models/users');

const addUser = (req, res) => {
  const { id } = req.body;
  const { email } = req.body;
  const { username } = req.body;

  if (id == null || email == null || username == null) {
    console.log(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  const userObj = new UserModel({
    userId: id,
    email: email,
    username: username
  });

  userObj.save()
    .then((doc) => {
      console.log(doc);
    })
    .catch((err) => {
      console.error(err);
  });

  var response = res.json({email: email, username: username});

	res.send(response);
};

// const getUser = (req, res) => {
//   const { id } = req.body;
  
//   if (id == null) {
//     console.log(`Missing parameters in ${req.body}`);
//     res.status(400);
//     res.end();
//     return;
//   }

//   UserModel.findOne({ userId: id})
//     .then((user) => {
//       if (user === null) {
//         console.log(`User ${id} was not found`);
//         res.status(400);

//         return;
//       }

//       var response = res.json({email: user.email, username: user.username});

//       res.send(response)
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

router.post("/", addUser);
// router.get("/", getUser);

module.exports = router;

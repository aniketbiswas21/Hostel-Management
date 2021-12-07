const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const brcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/Users");
const Complaints = require("../../models/Complaints");

// @route GET api/users/test
// @desc Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "It works!!" }));

// @route POST api/users/registers
// @desc Registers users
// @access  Public
router.post("/register", (req, res) => {
  console.log(req.body);
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email Already Exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        hostel: req.body.hostel,
        role: req.body.role,
        avatar,
        password: req.body.password,
      });

      brcrypt.genSalt(10, (err, salt) => {
        brcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          (newUser.password = hash),
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    brcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 7200 },
          (err, token) => {
            res.json({
              success: true,
              user,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route GET api/users/current
// @desc Return Current User
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.id) {
      const user = await User.findById(req.user.id);
      return res.json({ ...user });
    }
    // res.json({
    //   id: req.user.id,
    //   name: req.user.name,
    //   email: req.user.email,
    // });
  }
);

router.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json({ ...user });
});

router.post("/addComplaint", async (req, res) => {
  const complaint = await Complaints.create({
    description: req.body.description,
    user: req.body.user,
  });

  if (!complaint) {
    return res.status(400).json({
      msg: "Complaint not added",
    });
  }

  res.status(200).json({
    msg: "Complaint added",
    data: complaint,
  });
});

router.get("/complaints", async (req, res) => {
  const complaints = await Complaints.find();
  res.status(200).json({ data: complaints });
});

router.put("/resolve/:id", async (req, res) => {
  const complaint = await Complaints.findByIdAndUpdate(req.params.id, {
    resolved: true,
  });

  if (!complaint) {
    return res.status(400).json({
      msg: "Complaint not found",
    });
  }
  res.status(200).json({
    msg: "Complaint resolved",
    data: complaint,
  });
});

module.exports = router;

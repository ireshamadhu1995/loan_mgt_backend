const express = require("express");
const router = express.Router();
const users = require("../services/users");


/* Register users */
router.post("/", async function (req, res, next) {
  try {
    res.json(await users.create(req.body));
  } catch (err) {
    next(err);
  }
});

/* get loan details */
router.get("/:id", async function (req, res, next) {
  try {
    res.json(await users.userData(req.params.id));
  } catch (err) {
    next(err);
  }
});


/* Login to the system */
router.post("/login", async function (req, res, next) {
  try {
    res.json(await users.login(req.body));
  } catch (err) {
    next(err);
  }
});

/* Logout from the system */
router.post("/logout", async function (req, res, next) {
  try {
    res.json(await users.logout(req.body));
  } catch (err) {
    next(err);
  }
});

/* PUT users */
router.put("/:id", async function (req, res, next) {
  try {
    res.json(await users.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

/* DELETE users */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await users.remove(req.params.id));
  } catch (err) {
    next(err);
  }
});

module.exports = router;

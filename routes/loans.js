const express = require("express");
const router = express.Router();
const loans = require("../services/loans");
const fileUpload = require('express-fileupload');

const app = express()
app.use(fileUpload());

/* GET all loans */
router.get("/", async function (req, res, next) {
  try {
    res.json(await loans.getMultiple(req.query.page));
  } catch (err) {
   
    next(err);
  }
});

/* insert loan details */
router.post("/", async function (req, res, next) {
  try {
    
    res.json(await loans.create(req.body));
  } catch (err) {
 
    next(err);
  }
});

/* PUT loans */
router.put("/:id", async function (req, res, next) {
  try {
    res.json(await loans.update(req.params.id, req.body));
  } catch (err) {
    
    next(err);
  }
});

/* DELETE loans */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    res.json(await loans.remove(req.params.id));
  } catch (err) {
    
    next(err);
  }
});

/* Get by id loans */
router.get("/view/:id", async function (req, res, next) {
    try {
      res.json(await loans.getById(req.params.id));
    } catch (err) {
      
      next(err);
    }
  });

module.exports = router;

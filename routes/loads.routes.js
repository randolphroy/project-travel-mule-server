const router = require("express").Router();
const Loads = require("../models/Loads.model");
//const { viewLoads, createLoad, updateLoad, deleteLoad } = require('../controllers/loadController');

router.get('/loads', (req, res, next) => {
   Loads.find()
   .then (allLoads => {
    res.status(200).json({ allLoads })
   })
   .catch (err => {
    console.log(err)
   })
});

router.get('/loads/:id', (req, res, next) => {
    Loads.findById(req.params)
    .then (singleLoad => {
     res.status(200).json({ singleLoad })
    })
    .catch (error => {
     console.log('Error while retrieving the load details:'. error);
     next(error);
    })
 });



module.exports = router




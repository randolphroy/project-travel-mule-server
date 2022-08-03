const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middlware");
const Handler = require("../models/Handler.model");
const Loads = require("../models/Loads.model");
//const { viewLoads, createLoad, updateLoad, deleteLoad } = require('../controllers/loadController');

router.get('/loads', (req, res, next) => {
   Loads.find({ status: 'AVAILABLE'})
   .then (allLoads => {
    res.status(200).json({ allLoads })
   })
   .catch (err => {
    console.log(err)
   })
});

router.get('/loads/:id', (req, res, next) => {
    Loads.findById(req.params.id)
    .then (singleLoadDetail => {
     res.status(200).json(singleLoadDetail)
    })
    .catch (error => {
     console.log('Error while retrieving the load details:'. error);
     next(error);
    })
 });

 router.get('/previousLoads', isAuthenticated, (req, res, next) => {
   const userId = req.payload._id
   Loads.find({ handler: userId })
   .then (allLoads => {
    res.status(200).json({ allLoads })
   })
   .catch (err => {
    console.log(err)
   })
}); 

router.get('/acceptedload/:loadId', isAuthenticated, (req, res, next) => {
   const userId = req.payload._id
   Handler.findByIdAndUpdate(userId, {
      $push: {
         currentLoads: req.params.loadId 
      }
   }, {new: true} )
      .then(newHandler => {
         return Loads.findByIdAndUpdate(req.params.loadId, {
            handler: userId,
            status: 'IN_TRANSIT'
         }, { new: true})
      })
      .then(newLoad => {
         res.status(200).json(newLoad)
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({ message: err})
      })
}); 



module.exports = router




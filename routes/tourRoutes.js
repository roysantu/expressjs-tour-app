const express = require('express');

const tourController = require('../controllers/tourController');

// Routes
const router = express.Router();

router.route('/tour-stat').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTours)
  .delete(tourController.deleteTour);

module.exports = router;

// const fs = require('fs');
// const { query } = require('express');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};

// Route Handlers
exports.getAllTours = catchAsync(async (req, res, next) => {
  // try {
  // Execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  const allTours = await features.query;
  // const allTours = await features;
  // if (!allTours) {
  //   return next(new AppError('No tour found', 400));
  // }

  res.status(200).json({
    status: 'success',

    results: {
      count: allTours.length,
      tours: allTours,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'Failed',
  //     error: err,
  //     errorMessage: 'error fetching data',
  //   });
  // }
});

exports.getTourById = catchAsync(async (req, res, next) => {
  // try {
  const tourById = await Tour.findById(req.params.id).catch((err) =>
    console.log(err),
  );
  // console.log('tourById>>>>>>>', tourById);
  if (!tourById) {
    return next(new AppError(`No tour found with ID: `, 404));
  }

  res.status(200).json({
    status: 'success',
    result: {
      tourById,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'Failed',
  //     error: err,
  //     errorMessage: 'Error fetching data',
  //   });
  // }
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    tour: newTour,
  });
  // try {
  //   const newTour = await Tour.create(req.body);
  //   res.status(201).json({
  //     status: 'success',
  //     tour: newTour,
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'Failed',
  //     error: err,
  //     errorMessage: 'Invalid request body',
  //   });
  // }
});

exports.updateTours = catchAsync(async (req, res, next) => {
  const updatedTourById = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  ).catch((err) => console.log(err));

  if (!updatedTourById) {
    return next(new AppError(`No tour found with ID: `, 404));
  }

  res.status(200).json({
    status: 'success',
    result: {
      updatedTourById,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deleteTourById = await Tour.findByIdAndDelete(req.params.id);

  if (!deleteTourById) {
    return next(new AppError(`No tour found with ID: `, 404));
  }

  res.status(200).json({
    status: 'success',
    result: {
      deleteTourById,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        totalPrice: { $sum: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
    // { $match: { _id: { $ne: 'EASY' } } },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'Failed',
  //     error: err,
  //     errorMessage: 'Error at aggregate',
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const planYear = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${planYear}-01-01`),
          $lte: new Date(`${planYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    // {$addFields: { month: '$_id'}},
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              '',
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            '$_id',
          ],
        },
      },
    },

    { $sort: { numTourStarts: -1 } },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: {
      plan,
    },
  });
});

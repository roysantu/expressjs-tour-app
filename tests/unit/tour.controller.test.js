const TourController = require('../../controllers/tourController');
const TourModel = require('../../models/tourModel');
const httpMocks = require('node-mocks-http');

const createTourData = require('../mock-data/create-tour.json');

TourModel.create = jest.fn();
TourController.createTour = jest.fn();
let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe('TourController.getAllTours', () => {
  it('should have a get all tours function', () => {
    expect(typeof TourController.getAllTours).toBe('function');
  });
  it('should have a get tours by ID function', () => {
    expect(typeof TourController.getTourById).toBe('function');
  });
});

describe('Tour model', () => {
  it('should call TourModel.create', () => {
    req.body = createTourData;
    TourController.createTour(req, res, next);
    expect(TourModel.create).toBeCalledWith(createTourData);
  });

  it('should TourModel.create return 200', () => {
    req.body = createTourData;
    TourController.createTour(req, res, next);
    expect(res.statusCode).toBe(201);
    // expect(res._isEndCalled()).toBeTruthy();
  });
});

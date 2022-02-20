// Importing the Utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // req.body is !undefined because we have used a express.json() middleware
    const newDoc = await Model.create(req.body);

    // "201" means created
    res.status(201).json({
      status: 'success',
      data: { data: newDoc },
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const { body } = req;
    const { id } = req.params;

    const doc = await Model.findByIdAndUpdate(id, body, {
      // By using this, new updated document will be returned
      new: true,
      // It means run validator every time the doc is updated
      runValidators: true,
    });

    // If there is not doc, it is null
    if (!doc) {
      // EXPLANATION OF THIS "IF" BLOCK IS IN GET_DOCUMENT FUNCTION
      // throw new AppError('doc with this id is not found', 404);

      // Make sure to return it
      return next(new AppError('Document with this id is not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    // This "id" is a string
    const { id } = req.params;
    // Deleting the Document
    // It will return the Document that is deleted (as the resolved value of promise)
    const doc = await Model.findByIdAndDelete(id);

    // If there is not doc, it is null
    if (!doc) {
      // EXPLANATION OF THIS "IF" BLOCK IS IN GET_DOCUMENT FUNCTION
      // throw new AppError('Model with this id is not found', 404);

      // Make sure to return it
      return next(new AppError('Document with this id is not found', 404));
    }

    // Deleting response is "204" which means "no content"
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

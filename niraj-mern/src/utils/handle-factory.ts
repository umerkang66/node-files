import type { ReturnModelType } from '@typegoose/typegoose';
import type { Document, Model, PopulateOptions } from 'mongoose';
import { NotFoundError } from '../errors/not-found-error';
import { ApiFeatures } from './api-features';
import { catchAsync } from './catch-async';

function getAll(Mod: ReturnModelType<any>) {
  return catchAsync(async (req, res) => {
    const query = Mod.find();
    const requestQuery = req.query;

    // On the req.query, if there are some filter params present filter it, if fields are present limit it, if sort sort is present sort it, or if paginate is present paginate it.
    const features = new ApiFeatures(query, requestQuery)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const documents = await features.getQuery();
    res.send(documents);
  });
}

function getOne(
  Mod: ReturnModelType<any>,
  populateOptions?: PopulateOptions | PopulateOptions[]
) {
  return catchAsync(async (req, res) => {
    const { id } = req.params;
    const query = Mod.findById(id);

    if (populateOptions) {
      query.populate(populateOptions);
    }

    const document = await query;

    if (!document) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.send(document);
  });
}

function createOne(Mod: ReturnModelType<any>) {
  return catchAsync(async (req, res) => {
    const newDocument = Mod.build(req.body);
    await newDocument.save();

    res.status(201).send(newDocument);
  });
}

function updateOne(Mod: ReturnModelType<any>) {
  return catchAsync(async (req, res) => {
    // you should have run the validators (express-validators), before passing
    // the req.body to
    const updated = await Mod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.send(updated);
  });
}

function deleteOne(Mod: ReturnModelType<any>) {
  return catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedDocument = await Mod.findByIdAndDelete(id);

    if (!deletedDocument) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.status(204).send(null);
  });
}

export { getAll, getOne, createOne, updateOne, deleteOne };

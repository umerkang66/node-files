import type { Document, Model, PopulateOptions } from 'mongoose';
import { NotFoundError } from '../errors/not-found-error';
import { ApiFeatures } from './api-features';
import { catchAsync } from './catch-async';

// T is document, K is ModAttrs
interface IMod<T extends Document> extends Model<T> {
  build(docAttrs: any): T;
}

function getAll<T extends Document>(Mod: IMod<T>) {
  return catchAsync(async (req, res) => {
    const query = Mod.find();
    const requestQuery = req.query;

    // On the req.query, if there are some filter params present filter it, if fields are present limit it, if sort sort is present sort it, or if paginate is present paginate it.
    const features = new ApiFeatures(query, requestQuery)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const documents = (await features.getQuery()) as T[];
    res.send(documents);
  });
}

function getOne<T extends Document>(
  Mod: IMod<T>,
  populateOptions?: PopulateOptions[]
) {
  return catchAsync(async (req, res) => {
    const { id } = req.params;
    const query = Mod.findById(id);

    if (populateOptions) {
      query.populate(populateOptions);
    }

    const document = (await query) as T;

    if (!document) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.send(document);
  });
}

function createOne<T extends Document>(Mod: IMod<T>) {
  return catchAsync(async (req, res) => {
    const newDocument = Mod.build(req.body) as T;
    await newDocument.save();

    res.status(201).send(newDocument);
  });
}

function updateOne<T extends Document>(Mod: IMod<T>) {
  return catchAsync(async (req, res) => {
    // you should have run the validators (express-validators), before passing
    // the req.body to
    const updated = (await Mod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })) as T;

    if (!updated) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.send(updated);
  });
}

function deleteOne<T extends Document>(Mod: IMod<T>) {
  return catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedDocument = (await Mod.findByIdAndDelete(id)) as T;

    if (!deletedDocument) {
      throw new NotFoundError('Document with this id is not found');
    }
    res.status(204).send(null);
  });
}

export { getAll, getOne, createOne, updateOne, deleteOne };

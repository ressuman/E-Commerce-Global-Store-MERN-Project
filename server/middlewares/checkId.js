import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    const error = new Error(`Invalid ObjectId: ${req.params.id}`);
    error.status = 400;
    return next(error);
  }
  next();
}

export default checkId;

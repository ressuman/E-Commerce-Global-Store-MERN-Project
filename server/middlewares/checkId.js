import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.productId)) {
    const error = new Error(`Invalid ObjectId: ${req.params.productId}`);
    error.status = 400;
    return next(error);
  }
  next();
}

export default checkId;

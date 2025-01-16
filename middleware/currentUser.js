import { getMemberByUserId } from "../db/queries.js";

const currentUser = async (req, res, next) => {
  if (req.user) {
    const member = await getMemberByUserId(req.user.id);
    const isMember = member?.user_id > 0;
    const isAdmin = member?.admin || false;

    res.locals.currentUser = { ...req.user, isMember, isAdmin };
    return next();
  }

  res.locals.currentUser = req.user;
  next();
};

export default currentUser;

import User from "../models/User.js" 

export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({name: req.body.name});
    if (!user.name) {
      return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    next();
};
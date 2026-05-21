import AdminGroup from '../models/AdminGroup.js';
import User from '../models/User.js';

export const createAdminGroup =
  async (req, res) => {
    try {
      const { name, admins } = req.body;

      const group =
        await AdminGroup.create({
          name,
          admins,
        });

      await User.updateMany(
        {
          _id: { $in: admins },
        },
        {
          adminGroup: group._id,
        }
      );

      res.status(201).json({
        success: true,
        group,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
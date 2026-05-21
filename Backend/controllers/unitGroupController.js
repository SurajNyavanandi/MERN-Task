import UnitGroup from '../models/UnitGroup.js';
import User from '../models/User.js';

export const createUnitGroup =
  async (req, res) => {
    try {
      const { name, unitManagers } =
        req.body;

      const group =
        await UnitGroup.create({
          name,
          unitManagers,
        });

      await User.updateMany(
        {
          _id: { $in: unitManagers },
        },
        {
          unitGroup: group._id,
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
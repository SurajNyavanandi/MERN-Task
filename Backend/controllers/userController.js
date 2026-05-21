import User from '../models/User.js';

export const getUsers = async (
  req,
  res
) => {
  try {
    const currentUser = req.user;

    let users = [];

    // SUPER ADMIN

    if (
      currentUser.role ===
      'SUPER_ADMIN'
    ) {
      users = await User.find();
    }

    // ADMIN

    else if (
      currentUser.role === 'ADMIN'
    ) {
      const admin =
        await User.findById(
          currentUser.id
        );

      const adminIds = [admin._id];

      if (admin.adminGroup) {
        const groupedAdmins =
          await User.find({
            adminGroup:
              admin.adminGroup,
            role: 'ADMIN',
          });

        groupedAdmins.forEach(
          (a) => {
            adminIds.push(a._id);
          }
        );
      }

      users = await User.find({
        $or: [
          {
            createdBy: {
              $in: adminIds,
            },
          },
          {
            _id: {
              $in: adminIds,
            },
          },
        ],
      });
    }

    // UNIT MANAGER

    else if (
      currentUser.role ===
      'UNIT_MANAGER'
    ) {
      const manager =
        await User.findById(
          currentUser.id
        );

      const managerIds = [
        manager._id,
      ];

      if (manager.unitGroup) {
        const groupedManagers =
          await User.find({
            unitGroup:
              manager.unitGroup,
            role:
              'UNIT_MANAGER',
          });

        groupedManagers.forEach(
          (u) => {
            managerIds.push(u._id);
          }
        );
      }

      users = await User.find({
        $or: [
          {
            createdBy: {
              $in: managerIds,
            },
          },
          {
            _id: {
              $in: managerIds,
            },
          },
        ],
      });
    }

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (
  req,
  res
) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserRole =
  async (req, res) => {
    try {
      const { role } = req.body;

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          { role },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
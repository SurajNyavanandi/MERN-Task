import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    let users = [];

    // Filter by user type/role if provided
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Search by username or email
    if (req.query.search) {
      filter.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { userId: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // SUPER_ADMIN: Can see all users
    if (currentUser.role === 'SUPER_ADMIN') {
      const total = await User.countDocuments(filter);
      users = await User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total: total,
          limit: limit,
        },
        users,
      });
    }

    // ADMIN: Can see Unit Managers and Users created by them or grouped admins
    if (currentUser.role === 'ADMIN') {
      const admin = await User.findById(currentUser.id);
      const adminIds = [admin._id];

      // If admin is part of an admin group, include other admins in the group
      if (admin.adminGroup) {
        const groupedAdmins = await User.find({
          adminGroup: admin.adminGroup,
          role: 'ADMIN',
        });

        groupedAdmins.forEach((a) => {
          if (!adminIds.includes(a._id)) {
            adminIds.push(a._id);
          }
        });
      }

      // Find all Unit Managers created by these admins
      const unitManagerIds = [];
      const unitManagers = await User.find({
        createdBy: { $in: adminIds },
        role: 'UNIT_MANAGER',
      });

      unitManagers.forEach((um) => {
        unitManagerIds.push(um._id);
      });

      // Find all users created by these unit managers
      const userIds = [];
      const usersInSystem = await User.find({
        createdBy: { $in: unitManagerIds },
        role: 'USER',
      });

      usersInSystem.forEach((u) => {
        userIds.push(u._id);
      });

      // Apply role filter
      const viewableRoles = ['UNIT_MANAGER', 'USER'];
      if (filter.role && !viewableRoles.includes(filter.role)) {
        return res.status(403).json({
          success: false,
          message: `ADMIN can only view UNIT_MANAGER and USER roles`,
        });
      }

      let viewFilter = {
        $or: [
          { _id: { $in: adminIds }, role: 'ADMIN' }, // Other admins in same group
          { _id: { $in: unitManagerIds } },
          { _id: { $in: userIds } },
        ],
        ...filter,
      };

      const total = await User.countDocuments(viewFilter);
      users = await User.find(viewFilter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total: total,
          limit: limit,
        },
        users,
      });
    }

    // UNIT_MANAGER: Can see only Users they created and grouped unit managers
    if (currentUser.role === 'UNIT_MANAGER') {
      const manager = await User.findById(currentUser.id);
      const managerIds = [manager._id];

      // If manager is part of a unit group, include other managers in the group
      if (manager.unitGroup) {
        const groupedManagers = await User.find({
          unitGroup: manager.unitGroup,
          role: 'UNIT_MANAGER',
        });

        groupedManagers.forEach((m) => {
          if (!managerIds.includes(m._id)) {
            managerIds.push(m._id);
          }
        });
      }

      // Find all users created by these managers
      const userIds = [];
      const usersCreated = await User.find({
        createdBy: { $in: managerIds },
        role: 'USER',
      });

      usersCreated.forEach((u) => {
        userIds.push(u._id);
      });

      // Apply role filter - can only see USER role
      if (filter.role && filter.role !== 'USER') {
        return res.status(403).json({
          success: false,
          message: 'UNIT_MANAGER can only view USER role',
        });
      }

      let viewFilter = {
        _id: { $in: userIds },
        role: 'USER',
        ...filter,
      };

      const total = await User.countDocuments(viewFilter);
      users = await User.find(viewFilter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total: total,
          limit: limit,
        },
        users,
      });
    }

    // USER: Can only see themselves
    if (currentUser.role === 'USER') {
      const user = await User.findById(currentUser.id).select('-password');

      return res.status(200).json({
        success: true,
        users: [user],
      });
    }

    res.status(403).json({
      success: false,
      message: 'Invalid user role',
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users',
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'userId username email role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check authorization
    const currentUser = req.user;
    if (
      currentUser.id !== req.params.id &&
      currentUser.role !== 'SUPER_ADMIN' &&
      currentUser.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this user',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Authorization checks
    const currentUser = req.user;

    // SUPER_ADMIN can delete any user
    if (currentUser.role === 'SUPER_ADMIN') {
      // Don't allow deleting the only SUPER_ADMIN
      if (user.role === 'SUPER_ADMIN') {
        const superAdminCount = await User.countDocuments({
          role: 'SUPER_ADMIN',
        });
        if (superAdminCount === 1) {
          return res.status(403).json({
            success: false,
            message: 'Cannot delete the last SUPER_ADMIN',
          });
        }
      }
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }

    // ADMIN can delete UNIT_MANAGER and USER created by them or grouped admins
    if (currentUser.role === 'ADMIN') {
      const admin = await User.findById(currentUser.id);
      const adminIds = [admin._id];

      if (admin.adminGroup) {
        const groupedAdmins = await User.find({
          adminGroup: admin.adminGroup,
          role: 'ADMIN',
        });
        groupedAdmins.forEach((a) => {
          adminIds.push(a._id);
        });
      }

      // Check if user to delete was created by any of these admins
      if (!adminIds.includes(user.createdBy)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this user',
        });
      }

      // Can only delete UNIT_MANAGER or USER
      if (!['UNIT_MANAGER', 'USER'].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'ADMIN can only delete UNIT_MANAGER or USER',
        });
      }

      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }

    // UNIT_MANAGER can delete USER created by them or grouped managers
    if (currentUser.role === 'UNIT_MANAGER') {
      const manager = await User.findById(currentUser.id);
      const managerIds = [manager._id];

      if (manager.unitGroup) {
        const groupedManagers = await User.find({
          unitGroup: manager.unitGroup,
          role: 'UNIT_MANAGER',
        });
        groupedManagers.forEach((m) => {
          managerIds.push(m._id);
        });
      }

      if (!managerIds.includes(user.createdBy)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this user',
        });
      }

      if (user.role !== 'USER') {
        return res.status(403).json({
          success: false,
          message: 'UNIT_MANAGER can only delete USER',
        });
      }

      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }

    res.status(403).json({
      success: false,
      message: 'You do not have permission to delete users',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user',
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const currentUser = req.user;

    // Only SUPER_ADMIN can update roles
    if (currentUser.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only SUPER_ADMIN can update user roles',
      });
    }

    // Don't allow changing SUPER_ADMIN role
    if (user.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change SUPER_ADMIN role',
      });
    }

    user.role = role;
    await user.save();

    // Regenerate user ID based on new role
    let prefix = 'U';
    if (role === 'ADMIN') prefix = 'A';
    if (role === 'UNIT_MANAGER') prefix = 'UM';
    if (role === 'SUPER_ADMIN') prefix = 'SA';

    const count = await User.countDocuments({ role });
    user.userId = `${prefix}${count}`;
    await user.save();

    await user.populate('createdBy', 'userId username email role');

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user role',
    });
  }
};

export const updateUserTimezone = async (req, res) => {
  try {
    const { timezone } = req.body;

    const VALID_TIMEZONES = [
      'UTC',
      'GMT',
      'IST',
      'EST',
      'CST',
      'MST',
      'PST',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Hong_Kong',
      'Australia/Sydney',
    ];

    if (!timezone || !VALID_TIMEZONES.includes(timezone)) {
      return res.status(400).json({
        success: false,
        message: `Invalid timezone. Must be one of: ${VALID_TIMEZONES.join(', ')}`,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { timezone },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Timezone updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating timezone',
    });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const currentUser = req.user;

    if (currentUser.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only SUPER_ADMIN can deactivate users',
      });
    }

    user.isActive = false;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
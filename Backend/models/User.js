import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        'SUPER_ADMIN',
        'ADMIN',
        'UNIT_MANAGER',
        'USER',
      ],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    adminGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminGroup',
      default: null,
    },

    unitGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UnitGroup',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'User',
  userSchema
);
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,  // ✅ This already creates an index
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,  // ✅ This already creates an index
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'UNIT_MANAGER', 'USER'],
      required: true,
    },

    timezone: {
      type: String,
      default: 'UTC',
      enum: [
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
      ],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,  // ✅ Add index here instead
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

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Only keep indexes for non-unique fields that need fast lookups
userSchema.index({ role: 1 });

export default mongoose.model('User', userSchema);
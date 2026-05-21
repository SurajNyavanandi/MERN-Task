import mongoose from 'mongoose';

const adminGroupSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      admins: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  'AdminGroup',
  adminGroupSchema
);
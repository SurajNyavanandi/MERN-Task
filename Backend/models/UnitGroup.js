import mongoose from 'mongoose';

const unitGroupSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      unitManagers: [
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
  'UnitGroup',
  unitGroupSchema
);
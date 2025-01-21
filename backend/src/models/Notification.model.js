import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['budget', 'transaction'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  budget: {
    id: String,
    amount: Number,
    spent: Number,
    remaining: Number,
    period: String
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema); 
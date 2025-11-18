const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
      type: String, 
      required: [true, 'Exercise name is Required'] 
  },
  duration: { 
      type: String, 
      required: [true, 'Exercise duration is Required']
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending' 
  },
    dateAdded: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Workout', workoutSchema);
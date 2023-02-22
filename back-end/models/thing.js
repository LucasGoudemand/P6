const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  name: { type: String },
  manufacturer: { type: String },
  description: { type: String },
  heat: { type: Number },
  likes: { type: Number, default: 0},
  dislikes: { type: Number, default: 0},
  imageUrl: { type: String },
  mainPepper: { type: String },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: []  },
  userId: { type: String },

});
module.exports = mongoose.model('Thing', thingSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String }, 
  age: { type: Number },          
  sex: { type: String, enum: ['Male', 'Female', 'Other'] }, 
  address: { type: String },     
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('User', UserSchema);

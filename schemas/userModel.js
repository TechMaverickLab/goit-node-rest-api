const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: function() {
      return !this.verify;
    },
  },
});

userSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(6));
  
};

userSchema.methods.validPassword = function(password) {
  const isValid = bcrypt.compareSync(password, this.password);
  
  return isValid;
};

userSchema.pre('validate', function(next) {
  
  next();
});

userSchema.pre('save', async function(next) {
  
  
  
  if (!this.isNew) {
    
    return next();
  }

  if (!this.verificationToken) {
    const { nanoid } = await import('nanoid');
    this.verificationToken = nanoid();
    
  }

  
  next();
});

userSchema.post('save', function(doc, next) {
  
  next();
});

userSchema.pre('remove', async function(next) {
  
  next();
});

userSchema.post('remove', async function(doc, next) {
  
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;

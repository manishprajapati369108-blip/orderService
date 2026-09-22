import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: null,
    },

    type: {
     type : String,
      defualt : null
    },

    name: {
      type: String,
      required: true,
    },
   
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function() {
  // ✅ 'this' refers to the document being saved
  if (!this.isModified('password')) return ;
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (error) {
    throw error;
  }
});

export default mongoose.model('User', userSchema);

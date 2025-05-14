import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
        type: String,
        enum: ['student', 'author', 'admin'],
        default: 'student',
    },
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    bio: String,
    avatarUrl: String,
}, {
    timestamps: true,
});

export default mongoose.model("User", UserSchema);

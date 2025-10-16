import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // no need for extra options
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

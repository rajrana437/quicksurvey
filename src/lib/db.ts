import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI: string = 'mongodb://localhost:27017/quickSurvey';

console.log(MONGODB_URI);


const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // You can specify additional options here if needed, but 
      // `useNewUrlParser` and `useUnifiedTopology` are no longer necessary.
    } as ConnectOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;

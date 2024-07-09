import { connect } from "mongoose";

const connectToMongo = async () => {
  try {
    await connect(
      "mongodb+srv://saadahsankhan:EypcyZ2Zk2XNv7SX@merndatabase.0cdxobu.mongodb.net/enotebook"
    );
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;

import mongoose from "mongoose";

const connection = async () => {

    return await mongoose.connect(process.env.URL).then(() => {
        console.log("connected to database successfully");
    }).catch(
        () => {
            console.log("faild to connect your database");
        }
    )
}

export default connection


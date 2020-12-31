import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI && MONGO_STORE_URI must be defined');
}
export const storeMongoConnection = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
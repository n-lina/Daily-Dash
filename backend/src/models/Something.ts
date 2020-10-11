import { Schema, Document, Model, model } from "mongoose";

const SomeScheme = new Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Number
    }
});

export interface ISomething {
    message: string;
    date: number;
}

export interface ISomethingDocument extends ISomething, Document {}
export interface ISomethingModel extends Model<ISomethingDocument> {}
export default SomeScheme;
export const SomethingModel = model<ISomethingDocument>("something", SomeScheme);
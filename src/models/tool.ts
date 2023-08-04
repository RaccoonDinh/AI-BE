import { Document, Schema, SchemaTimestampsConfig, model } from "mongoose";

export interface ITool {
  thumbnail: string;
  name: string;
  description: string;
  link: string;
}

export interface IToolModel extends ITool, Document, SchemaTimestampsConfig {}

export const AdminSchema: Schema = new Schema(
  {
    thumbnail: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    link: { type: String, require: true },
  },
  { timestamps: true }
);

const Tool = model<IToolModel>("Tool", AdminSchema);

export default Tool;

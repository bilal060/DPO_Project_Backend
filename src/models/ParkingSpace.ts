import {
    Model, Schema, model
  } from 'mongoose';
  import TimeStampPlugin, {
    ITimeStampedDocument
  } from './plugins/timestamp-plugin';
  
  export interface IParkingSpaces extends ITimeStampedDocument {
    name: String;
    location: String;
    noOfParkingSpaces: Number,
    manager: Schema.Types.ObjectId;
    owner: Schema.Types.ObjectId;
    perDayCost: Number;
    perMonthCost: Number;
    longitude: Number;
    latitude: Number;
    description: String;
    images: Array<String>;
    ratings: Number;
    ratingSum: Number;
    ratingsArray: Array<Object>;
  }
  
  interface IParkingSpacesModel extends Model<IParkingSpaces> { }
  
  const schema = new Schema<IParkingSpaces>({
    name: { type: String, index: true, required: true },
    location: { type: String, required: true },
    noOfParkingSpaces: { type: Number, required: true },
    perDayCost: { type: Number, required: true },
    perMonthCost: { type: Number, required: true },
    description: { type: String},
    longitude: { type: Number},
    latitude: { type: Number},
    images: {type: Array},
    ratings: {type: Number, default: 0},
    ratingSum: {type: Number, default: 0 },
    ratingsArray: {type: Array, default: []},
    owner: { type: Schema.Types.ObjectId, ref: "Users" },
    manager: { type: Schema.Types.ObjectId, ref: "Users" }
  });
  
  // Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
  schema.plugin(TimeStampPlugin);
  
  const ParkingSpaces: IParkingSpacesModel = model<IParkingSpaces, IParkingSpacesModel>('ParkingSpaces', schema);
  
  export default ParkingSpaces;
  
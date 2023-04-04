import {
    Model, Schema, model
  } from 'mongoose';
  import TimeStampPlugin, {
    ITimeStampedDocument
  } from './plugins/timestamp-plugin';
  
  export interface IBookings extends ITimeStampedDocument {
    parkingSpaceId: Schema.Types.ObjectId;
    parkingSpacesToBeConsumed: Number,
    startDate: number;
    endDate: number;
    totalCost: Number;
    remainingParkingSpaces: Number;
    userId: Schema.Types.ObjectId;
    bookingDays: Number;
    bookingStatus: string;
  }
  
  interface IBookingsModel extends Model<IBookings> { }
  
  const schema = new Schema<IBookings>({
    parkingSpacesToBeConsumed: { type: Number, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    bookingDays: { type: Number },
    totalCost: { type: Number},
    remainingParkingSpaces: { type: Number},
    parkingSpaceId: { type: Schema.Types.ObjectId, ref: "ParkingSpaces" , required: true},
    userId: { type: Schema.Types.ObjectId, ref: "Users" ,required: true},
    bookingStatus: { type: String, default: "created", enum: ["created", "confirmed", "cancelled", "completed"]}
  });
  
  // Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
  schema.plugin(TimeStampPlugin);
  
  const Bookings: IBookingsModel = model<IBookings, IBookingsModel>('Bookings', schema);
  
  export default Bookings;
  
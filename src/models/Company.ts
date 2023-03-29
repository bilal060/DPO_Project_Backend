import {
    Model, Schema, model
  } from 'mongoose';
  import TimeStampPlugin, {
    ITimeStampedDocument
  } from './plugins/timestamp-plugin';
  
  export interface ICompanies extends ITimeStampedDocument {
    companyName: string;
    legalAddress: string;
    fein: string,
    owndershipProof: string;
    identificationProof: string,
    companyProfilePicture: string;
    companyDescription: string;
    companyLocation: string;
    availableSpace: string;
    propertyPhotos: Array<String>;
    bankName: String;
    bankAddress: String;
    routingNumber: String;
    accountNumber: String;
    companyCredentials: Schema.Types.ObjectId;
    profileCompletionStep: Number;
  }
  
  interface ICompaniesModel extends Model<ICompanies> { }
  
  const schema = new Schema<ICompanies>({
    companyName: { type: String, index: true, required: true },
    legalAddress: { type: String, required: true },
    fein: { type: String },
    owndershipProof: { type: String },
    identificationProof: { type: String },
    companyDescription: { type: String },
    companyLocation: { type: String },
    availableSpace: { type: String },
    propertyPhotos: {type: Array},
    bankName: { type: String },
    companyProfilePicture: { type: String },
    bankAddress: { type: String },
    routingNumber: { type: String },
    accountNumber: { type: String },
    companyCredentials: { type: Schema.Types.ObjectId, ref: "Users" },
    profileCompletionStep: {type: Number}

  });
  
  // Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
  schema.plugin(TimeStampPlugin);
  
  const Companies: ICompaniesModel = model<ICompanies, ICompaniesModel>('companies', schema);
  
  export default Companies;
  
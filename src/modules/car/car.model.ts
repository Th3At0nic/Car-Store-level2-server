import { Schema, model } from 'mongoose';
import { TCar, CarCategory } from './car.interface';

//creating a schema based on the type Car
const carSchema = new Schema<TCar>(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Brand cannot be an empty string.',
      },
    },
    model: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Model cannot be an empty string.',
      },
    },
    year: { type: Number, required: true },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number.'],
    },
    category: {
      type: String,
      enum: Object.values(CarCategory),
      required: true,
    },
    description: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
    },
    inStock: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    versionKey: false, // Disable the version key
  },
);

//creating a model based on the carSchema
export const CarModel = model<TCar>('Car', carSchema);

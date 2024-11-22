import { Schema, model } from 'mongoose';
import { TCar, CarCategory } from './car.interface';

//creating a schema based on the type Car
const carSchema = new Schema<TCar>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: Object.values(CarCategory),
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

//creating a model based on the carSchema
export const CarModel = model<TCar>('Car', carSchema);

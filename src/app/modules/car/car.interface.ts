//using enum to define allowed car category
/* eslint-disable no-unused-vars */
export enum CarCategory {
  Sedan = 'Sedan',
  SUV = 'SUV',
  Truck = 'Truck',
  Coupe = 'Coupe',
  Convertible = 'Convertible',
}

export type TCar = {
  brand: string; // The brand or manufacturer of the car (such as: Toyota, BMW, Ford)
  model: string; // The model of the car (such as: Camry, 3 Series, Focus)
  year: number; // The year of manufacture
  price: number; // Price of the car
  category: CarCategory; // The type of car (like: Sedan, SUV, Truck, Coupe, Convertible)
  description: string; // A brief description of the car's features
  quantity: number; // Quantity of the car available
  inStock: boolean; // Indicates if the car is in stock
  images: string[];
};

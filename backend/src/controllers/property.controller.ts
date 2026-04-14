import { Request, Response } from 'express';

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
};

const properties: Property[] = [
  { id: 1, title: 'Blue Haven Hostel', location: 'Jabalpur', price: 7800 },
  { id: 2, title: 'City View Apartment', location: 'Napier Town, Jabalpur', price: 14500 },
  { id: 3, title: 'Lakefront Villa Stay', location: 'Bhedaghat, Jabalpur', price: 22500 },
  { id: 4, title: 'Budget Student Flat', location: 'Gorakhpur, Jabalpur', price: 6900 },
  { id: 5, title: 'Metro Comfort PG', location: 'Wright Town, Jabalpur', price: 8300 }
];

export const listProperties = async (_req: Request, res: Response) => {
  return res.status(200).json(properties);
};

export const getPropertyById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: 'Invalid property id' });
  }

  const property = properties.find((item) => item.id === id);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  return res.status(200).json(property);
};

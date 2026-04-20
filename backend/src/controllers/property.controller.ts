import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';
import { cacheUtil } from '../utils/cache.util';

const createPropertySchema = z.object({
  proprietorName: z.string().min(2, 'Proprietor name is required'),
  mobileNumber: z.string().min(10, 'Mobile number is required'),
  alternativeMobileNumber: z.string().optional(),
  email: z.string().email('Valid email is required'),
  permanentAddress: z.string().min(5, 'Permanent address is required'),
  rentalAddress: z.string().min(5, 'Rental address is required'),
  quickRent: z.boolean().default(false),
  rentDurations: z.array(z.enum(['ONE_DAY', 'ONE_WEEK', 'ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'ONE_YEAR'])),
  rentalCategory: z.enum(['HOSTELS_PG', 'VEHICLES']),
  hostelType: z.enum(['SINGLE_BED_ROOM', 'DOUBLE_BED_ROOM', 'HOSTEL', 'FLAT', 'HOUSE', 'APARTMENT', 'OTHER']).optional(),
  surfaceArea: z.number().int().positive().optional(),
  parkingBikeScooter: z.boolean().default(false),
  parkingCar: z.boolean().default(false),
  furnitureBed: z.boolean().default(false),
  furnitureTable: z.boolean().default(false),
  furnitureChair: z.boolean().default(false),
  furnitureBardrove: z.boolean().default(false),
  furnitureAlmirah: z.boolean().default(false),
  furnitureKitchenWare: z.boolean().default(false),
  nearbyPlaces: z.string().optional(),
  bachelorAllowed: z.boolean().optional(),
  cctvAvailable: z.boolean().optional(),
  lunchDinnerOption: z.enum(['INCLUDED', 'NOT_AVAILABLE', 'PAY_EXTRA']).optional(),
  lateNightEntryAllowed: z.boolean().optional(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  images: z.array(z.string()).default([])
});

const updatePropertySchema = createPropertySchema.partial();

export const createPropertyListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Creating property listing for user:', req.user.id);
    const validatedData = createPropertySchema.parse(req.body);
    console.log('Validation passed, creating property with', validatedData.images?.length || 0, 'images');

    const property = await prisma.propertyListing.create({
      data: {
        userId: req.user.id,
        ...validatedData
      }
    });

    console.log('Property created successfully:', property.id);
    cacheUtil.delByPattern('public-properties:');
    cacheUtil.delByPattern('user-properties:');

    return res.status(201).json({ message: 'Property listing created successfully', property });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Error creating property listing:', error);
    return res.status(500).json({ message: 'Failed to create property listing', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getPropertyListings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const cacheKey = `user-properties:${req.user.id}:${page}:${limit}`;
    const cached = cacheUtil.get<{ properties: any[]; total: number; page: number; totalPages: number }>(cacheKey);

    if (cached) {
      return res.status(200).json(cached);
    }

    const [properties, total] = await Promise.all([
      prisma.propertyListing.findMany({
        where: { userId: req.user.id },
        select: {
          id: true,
          title: true,
          rentalCategory: true,
          rentalAddress: true,
          description: true,
          images: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.propertyListing.count({ where: { userId: req.user.id } })
    ]);

    const response = {
      properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
    cacheUtil.set(cacheKey, response, 180); // Cache for 3 minutes

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching property listings:', error);
    return res.status(500).json({ message: 'Failed to fetch property listings' });
  }
};

export const getPropertyListingById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const cacheKey = `property:${id}:${req.user.id}`;
    const cached = cacheUtil.get<{ property: any }>(cacheKey);

    if (cached) {
      return res.status(200).json(cached);
    }

    const property = await prisma.propertyListing.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    const response = { property };
    cacheUtil.set(cacheKey, response, 300); // Cache for 5 minutes

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching property listing:', error);
    return res.status(500).json({ message: 'Failed to fetch property listing' });
  }
};

export const updatePropertyListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const validatedData = updatePropertySchema.parse(req.body);

    const property = await prisma.propertyListing.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    const updatedProperty = await prisma.propertyListing.update({
      where: { id },
      data: validatedData
    });

    cacheUtil.del(`property:${id}:${req.user.id}`);
    cacheUtil.delByPattern(`user-properties:${req.user.id}:`);
    cacheUtil.delByPattern('public-properties:');
    cacheUtil.delByPattern(`public-property:${id}`);

    return res.status(200).json({ message: 'Property listing updated successfully', property: updatedProperty });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Error updating property listing:', error);
    return res.status(500).json({ message: 'Failed to update property listing' });
  }
};

export const deletePropertyListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const property = await prisma.propertyListing.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    await prisma.propertyListing.delete({
      where: { id }
    });

    cacheUtil.del(`property:${id}:${req.user.id}`);
    cacheUtil.delByPattern(`user-properties:${req.user.id}:`);
    cacheUtil.delByPattern('public-properties:');
    cacheUtil.delByPattern(`public-property:${id}`);

    return res.status(200).json({ message: 'Property listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting property listing:', error);
    return res.status(500).json({ message: 'Failed to delete property listing' });
  }
};

export const listPublicProperties = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const cacheKey = `public-properties:${page}:${limit}`;
    const cached = cacheUtil.get<{ properties: any[]; total: number; page: number; totalPages: number }>(cacheKey);

    if (cached) {
      return res.status(200).json(cached);
    }

    const [properties, total] = await Promise.all([
      prisma.propertyListing.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          title: true,
          rentalCategory: true,
          rentalAddress: true,
          description: true,
          images: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.propertyListing.count({ where: { status: 'ACTIVE' } })
    ]);

    const response = {
      properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
    cacheUtil.set(cacheKey, response, 60); // Cache for 1 minute

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching public properties:', error);
    return res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

export const getPublicPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cacheKey = `public-property:${id}`;
    const cached = cacheUtil.get<{ property: any }>(cacheKey);

    if (cached) {
      return res.status(200).json(cached);
    }

    const property = await prisma.propertyListing.findFirst({
      where: { id, status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const response = { property };
    cacheUtil.set(cacheKey, response, 300); // Cache for 5 minutes

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({ message: 'Failed to fetch property' });
  }
};

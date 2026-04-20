import { Router } from 'express';
import {
  createPropertyListing,
  deletePropertyListing,
  getPropertyListingById,
  getPropertyListings,
  getPublicPropertyById,
  listPublicProperties,
  updatePropertyListing
} from '../controllers/property.controller';
import { asyncHandler } from '../middleware/async-handler.middleware';
import { requireAuth } from '../middleware/auth.middleware';

export const propertyRouter = Router();

// Public endpoints
propertyRouter.get('/public', asyncHandler(listPublicProperties));
propertyRouter.get('/public/:id', asyncHandler(getPublicPropertyById));

// Protected endpoints (require authentication)
propertyRouter.use(requireAuth);
propertyRouter.post('/', asyncHandler(createPropertyListing));
propertyRouter.get('/', asyncHandler(getPropertyListings));
propertyRouter.get('/:id', asyncHandler(getPropertyListingById));
propertyRouter.patch('/:id', asyncHandler(updatePropertyListing));
propertyRouter.delete('/:id', asyncHandler(deletePropertyListing));

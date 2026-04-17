import { Router } from 'express';
import { getPropertyById, listProperties } from '../controllers/property.controller';
import { asyncHandler } from '../middleware/async-handler.middleware';

export const propertyRouter = Router();

propertyRouter.get('/', asyncHandler(listProperties));
propertyRouter.get('/:id', asyncHandler(getPropertyById));

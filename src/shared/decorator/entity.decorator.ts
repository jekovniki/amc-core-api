import { SetMetadata } from '@nestjs/common';
import { ENTITY_LOCATION } from '../interface/entity.enum';

export const ENTITY_LOCATION_KEY = 'entity_location';
export const Entities = (location: ENTITY_LOCATION) => SetMetadata(ENTITY_LOCATION_KEY, location);

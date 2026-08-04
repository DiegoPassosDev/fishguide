import { PartialType } from '@nestjs/swagger';
import { CreateFishingSpotDto } from './create-fishing-spot.dto.js';

export class UpdateFishingSpotDto extends PartialType(CreateFishingSpotDto) {}

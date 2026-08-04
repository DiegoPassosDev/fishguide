import { PartialType } from '@nestjs/swagger';
import { CreateSpeciesDto } from './create-species.dto.js';

export class UpdateSpeciesDto extends PartialType(CreateSpeciesDto) {}

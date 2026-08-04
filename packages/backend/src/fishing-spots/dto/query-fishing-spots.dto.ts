import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SpotType } from './create-fishing-spot.dto.js';

export class QueryFishingSpotsDto {
  @ApiPropertyOptional({ description: 'Busca por nome' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por tipo de água',
    enum: SpotType,
  })
  @IsEnum(SpotType)
  @IsOptional()
  spotType?: SpotType;

  @ApiPropertyOptional({ description: 'Latitude do centro da busca' })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude do centro da busca' })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Raio de busca em km (requer latitude/longitude)',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? Number.parseFloat(value) : Number(value),
  )
  @IsNumber()
  @Min(1)
  @Max(500)
  @IsOptional()
  radiusKm?: number;

  @ApiPropertyOptional({ description: 'Limite de resultados' })
  @Transform(({ value }) =>
    typeof value === 'string' ? Number.parseInt(value, 10) : Number(value),
  )
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset para paginação' })
  @Transform(({ value }) =>
    typeof value === 'string' ? Number.parseInt(value, 10) : Number(value),
  )
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;
}

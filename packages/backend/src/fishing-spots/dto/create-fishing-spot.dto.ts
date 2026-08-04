import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum SpotType {
  BEACH = 'BEACH',
  RIVER = 'RIVER',
  MANGROVE = 'MANGROVE',
  ROCKY_SHORE = 'ROCKY_SHORE',
  DAM = 'DAM',
  OPEN_SEA = 'OPEN_SEA',
  ESTUARY = 'ESTUARY',
  CANAL = 'CANAL',
}

export enum SpotVisibility {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
  APPROXIMATE = 'approximate',
}

export class CreateFishingSpotDto {
  @ApiProperty({ description: 'Nome do pesqueiro' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ description: 'Descrição do pesqueiro' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Tipo de água', enum: SpotType })
  @IsEnum(SpotType)
  @IsOptional()
  spotType?: SpotType;

  @ApiPropertyOptional({ description: 'Tipo de acesso' })
  @IsString()
  @IsOptional()
  accessType?: string;

  @ApiPropertyOptional({ description: 'Estrutura do pesqueiro' })
  @IsString()
  @IsOptional()
  structure?: string;

  @ApiPropertyOptional({ description: 'Fotos do pesqueiro', type: [String] })
  @IsArray()
  @IsOptional()
  photos?: string[];

  @ApiPropertyOptional({
    description: 'Visibilidade do pesqueiro',
    enum: SpotVisibility,
  })
  @IsEnum(SpotVisibility)
  @IsOptional()
  privacy?: SpotVisibility;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSpeciesDto {
  @ApiProperty({ description: 'Nome comum da espécie' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ description: 'Nome científico' })
  @IsString()
  @MaxLength(160)
  @IsOptional()
  scientificName?: string;

  @ApiPropertyOptional({ description: 'URL da foto da espécie' })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({ description: 'Peso médio em kg' })
  @IsNumber()
  @IsOptional()
  averageWeight?: number;

  @ApiPropertyOptional({ description: 'Tamanho médio em cm' })
  @IsNumber()
  @IsOptional()
  averageLength?: number;

  @ApiPropertyOptional({ description: 'Habitat' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  habitat?: string;

  @ApiPropertyOptional({ description: 'Comportamento alimentar' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  feeding?: string;

  @ApiPropertyOptional({ description: 'Melhor época do ano' })
  @IsString()
  @MaxLength(120)
  @IsOptional()
  bestSeason?: string;

  @ApiPropertyOptional({ description: 'Melhor maré' })
  @IsString()
  @MaxLength(120)
  @IsOptional()
  bestTide?: string;

  @ApiPropertyOptional({ description: 'Melhor fase da lua' })
  @IsString()
  @MaxLength(120)
  @IsOptional()
  bestMoon?: string;

  @ApiPropertyOptional({ description: 'Melhor isca' })
  @IsString()
  @MaxLength(120)
  @IsOptional()
  bestBait?: string;
}

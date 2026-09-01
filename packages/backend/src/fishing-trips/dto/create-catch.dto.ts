import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCatchDto {
  @ApiProperty({ description: 'ID da espécie' })
  @IsUUID()
  speciesId: string;

  @ApiPropertyOptional({ description: 'Peso em kg' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'Comprimento em cm' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  length?: number;

  @ApiPropertyOptional({ description: 'Notas' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Foto (base64 data URL)' })
  @IsOptional()
  @IsString()
  photo?: string;
}

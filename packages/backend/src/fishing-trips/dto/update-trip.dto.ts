import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTripDto {
  @ApiPropertyOptional({ description: 'ID do pesqueiro' })
  @IsOptional()
  @IsUUID()
  spotId?: string;

  @ApiPropertyOptional({ description: 'Notas da pescaria' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Local da pescaria' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Privacidade' })
  @IsOptional()
  @IsString()
  privacy?: string;

  @ApiPropertyOptional({ description: 'Data/hora de início' })
  @IsOptional()
  @IsString()
  date?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class QuerySpeciesDto {
  @ApiPropertyOptional({ description: 'Busca por nome comum ou científico' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtro por habitat' })
  @IsString()
  @IsOptional()
  habitat?: string;

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

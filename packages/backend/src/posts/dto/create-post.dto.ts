import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CatchSnapshotDto {
  @ApiPropertyOptional({ description: 'Espécie capturada' })
  @IsOptional()
  @IsString()
  species?: string;

  @ApiPropertyOptional({ description: 'Peso (texto livre, ex.: 4,2 kg)' })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiPropertyOptional({ description: 'Local da captura' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Condição da maré' })
  @IsOptional()
  @IsString()
  tide?: string;
}

export class CreatePostDto {
  @ApiProperty({ description: 'Conteúdo da publicação' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ description: 'Tópico/assunto da publicação' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ description: 'Foto (base64 data URL)' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({ description: 'Resumo da captura associada' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CatchSnapshotDto)
  catchInfo?: CatchSnapshotDto;
}

import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CatchSnapshotDto } from './create-post.dto.js';

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Conteúdo da publicação' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiPropertyOptional({ description: 'Tópico/assunto da publicação' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({
    description: 'Foto (base64 data URL). Enviar null para remover',
    type: String,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  photo?: string | null;

  @ApiPropertyOptional({
    description: 'Resumo da captura associada. Enviar null para remover',
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CatchSnapshotDto)
  catchInfo?: CatchSnapshotDto | null;
}

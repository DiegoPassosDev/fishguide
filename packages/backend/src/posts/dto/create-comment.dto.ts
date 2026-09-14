import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Conteúdo do comentário' })
  @IsString()
  @MinLength(1)
  content: string;
}

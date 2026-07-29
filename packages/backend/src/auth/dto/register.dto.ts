import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "João Silva" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "joao@email.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "senha123" })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCreatedResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service.js";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { ForgotPasswordDto } from "./dto/forgot-password.dto.js";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Registrar novo usuário" })
  @ApiCreatedResponse({ description: "Usuário criado com sucesso" })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Autenticar usuário" })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Solicitar redefinição de senha" })
  forgotPassword(@Body() _dto: ForgotPasswordDto) {
    return { message: "Se o email existir, um link será enviado." };
  }
}

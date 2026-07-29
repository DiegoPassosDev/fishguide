import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { UsersService } from "./users.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@ApiTags("Usuários")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Obter perfil do usuário logado" })
  getProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.users.findById(user.id);
  }

  @Patch("me")
  @ApiOperation({ summary: "Atualizar perfil do usuário logado" })
  updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as { id: string };
    return this.users.update(user.id, dto);
  }
}

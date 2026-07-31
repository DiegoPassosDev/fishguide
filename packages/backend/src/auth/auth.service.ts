import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.client.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.signToken(user);
  }

  async login(dto: LoginDto) {
    const row = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!row) throw new UnauthorizedException('Usuário não cadastrado');

    const valid = await bcrypt.compare(dto.password, row.passwordHash);
    if (!valid) throw new UnauthorizedException('Senha incorreta');

    await this.prisma.client.user.update({
      where: { id: row.id },
      data: { lastLogin: new Date() },
    });

    const { passwordHash: _, ...user } = row;
    return this.signToken(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const exists = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (!exists) throw new NotFoundException('Email não cadastrado');

    return { message: 'Link de recuperação enviado para seu email.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const row = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!row) throw new UnauthorizedException('Usuário não encontrado');

    const valid = await bcrypt.compare(dto.currentPassword, row.passwordHash);
    if (!valid) throw new UnauthorizedException('Senha atual incorreta');

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.client.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Senha alterada com sucesso.' };
  }

  private signToken(user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);

    return { accessToken: token, user };
  }
}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Autenticação opcional: rotas públicas continuam acessíveis por visitantes,
 * mas devolvem o usuário quando houver cookie/token válido.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: unknown, user: TUser): TUser | undefined {
    if (err || !user) return undefined;
    return user;
  }
}

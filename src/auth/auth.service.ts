import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { UsersRepository } from './users.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { sign, verify } from './jwt';
import { RefreshDto } from './dto/refresh.dto';

const ACCESS_TTL = 15 * 60;
const REFRESH_TTL = 7 * 24 * 60 * 60;

@Injectable()
export class AuthService {
    constructor(private readonly users: UsersRepository) {}

    async register(dto: RegisterDto): Promise <{ id: string; email: string }> {
        if (await this.users.findByEmail(dto.email!)) {
            throw new ConflictException('Email ya registrado');
        }
        const user = await this.users.save(dto.email!, hash(dto.password!));
        return { id: user.id!, email: user.email! };
    }
    async login(dto: LoginDto,): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.users.findByEmail(dto.email!);
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }
    if (user.passwordHash !== hash(dto.password!)) {
      throw new UnauthorizedException('Password incorrecto');
    }
    const claims = { sub: user.id!, email: user.email! };
    const accessToken = sign({ ...claims, type: 'access' }, ACCESS_TTL);
    const refreshToken = sign({ ...claims, type: 'refresh' }, REFRESH_TTL);
    console.log('Login de ' + user.email + ': ' + accessToken);
    return { accessToken, refreshToken };
  }

  refresh(dto: RefreshDto): { accessToken: string } {
    const payload = verify(dto.refreshToken!);
    if (!payload || payload.type !== 'refresh') {
      throw new UnauthorizedException('Refresh token inválido');
    }
    const accessToken = sign(
      { sub: payload.sub, email: payload.email, type: 'access' },
      ACCESS_TTL,
    );
    return { accessToken };
  }
}

function hash(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

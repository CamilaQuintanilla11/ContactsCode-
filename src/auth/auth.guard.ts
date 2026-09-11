import { CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { verify } from './jwt';

/**
 * AuthGuard es una función que protege las rutas de la API implementando JWT de acceso.
 * implementa CanActivate, que es una interfaz de NestJS que regresa un booleano indicando si la ruta puede ser accedida.
 * utiliza {@link verify} para validar, y deja el payload del token en req.user para que pueda ser usado en los controladores.
 * 
 * 
 * Si el token no es válido, regresa un UnauthorizedException 401
 * 
 */
@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const header: string = req.headers.authorization ?? '';
        if (!header.startsWith('Bearer ')) {
            throw new UnauthorizedException('Falta token de autorización');
        }
        const payload = verify(header.slice('Bearer '.length));
        if (!payload || payload.type !== 'access') {
            throw new UnauthorizedException('Token inválido o expirado');
        }
        req.user = payload;
        return true;
    }
}
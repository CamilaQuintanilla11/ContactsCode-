// register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
export class RegisterDto {
@ApiProperty({ description: 'Email' , example: 'ana@example.com' })
@IsEmail()
email: string | undefined;
@ApiProperty({ description: 'Contrasena' , example: 'secreto123', minLength: 8 })
@IsString()
@MinLength(8)
password: string | undefined;
}
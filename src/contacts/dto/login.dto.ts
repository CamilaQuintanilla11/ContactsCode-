// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
export class LoginDto {
@ApiProperty({ description:'Email', example: 'ana@example.com' })
@IsEmail()
email: string | undefined;
@ApiProperty({ description: 'contrasena', example: 'secreto123' })
@IsString()
password: string | undefined;
}
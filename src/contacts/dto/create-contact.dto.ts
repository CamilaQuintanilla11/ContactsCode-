import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'Nombre del contacto', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Email del contacto', example: 'juan.perez@example.com' })
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Teléfono del contacto', example: '+1234567890' })
  @Matches(/^(\+?[0-9][\s-]*)+$/, { message: 'phone inválido' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Notas del contacto', example: 'Amigo de la uni' })
  @IsOptional()
  @IsString()
  notes?: string;
}

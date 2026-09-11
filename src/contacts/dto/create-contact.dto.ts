import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^(\+?[0-9][\s-]*)+$/, { message: 'phone inválido' })
  phone: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

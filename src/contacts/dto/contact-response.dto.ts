import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';

export class ContactResponseDto {
    @ApiProperty({ description: 'UUID del contacto', example: '123e4567-e89b-12d3-a456-426614174000' })
    id!: string | undefined;

    @ApiProperty({ description: 'Nombre del contacto', example: 'Juan Pérez' })
    name!: string | undefined;

    @ApiProperty({ description: 'Email del contacto', example: 'juan.perez@example.com' })
    email!: string | undefined;

    @ApiProperty({ description: 'Teléfono del contacto', example: '+1234567890' })
    phone!: string | undefined;

    @ApiPropertyOptional({ description: 'Notas del contacto', example: 'Amigo de la uni' })
    notes?: string | undefined;
    
    @ApiProperty({ description: 'Fecha de creación', example: '2023-01-01T00:00:00.000Z' })
    createdAt!: string | undefined;

    static fromEntity(contact: Contact): ContactResponseDto {
        const dto = new ContactResponseDto();
        dto.id = contact.id;
        dto.name = contact.name;
        dto.email = contact.email;
        dto.phone = contact.phone;
        dto.notes = contact.notes;
        dto.createdAt = contact.createdAt?.toISOString();
        return dto;
    }
}
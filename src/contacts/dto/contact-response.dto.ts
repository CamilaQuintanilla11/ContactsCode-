import { Contact } from '../entities/contact.entity';

export class ContactResponseDto {
    id!: string | undefined;
    name!: string | undefined;
    email!: string | undefined;
    phone!: string | undefined;
    notes?: string | undefined;
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
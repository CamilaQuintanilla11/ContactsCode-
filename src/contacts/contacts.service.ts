/* eslint-disable @typescript-eslint/require-await */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { Contact } from './entities/contact.entity';
import { ContactResponseDto } from './dto/contact-response.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly repository: ContactsRepository) { }

  async create(userId: string, data: any): Promise<ContactResponseDto> {
    const contact = await this.repository.save(userId, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      ownerId: userId
    });
    return ContactResponseDto.fromEntity(contact);
  }

  async findAll(userId: string): Promise<ContactResponseDto[]> {
    return (await this.repository.findAll()).map((c) =>
      ContactResponseDto.fromEntity(c),
    );
  }

  async findOne(id: string): Promise<ContactResponseDto> {
    const contact = await this.repository.findById(id);
    if (!contact) {
      throw new NotFoundException('Contacto ' + id + ' no encontrado');
    }
    return ContactResponseDto.fromEntity(contact);
  }

  async update(
    id: string,
    changes: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const updated = await this.repository.update(id, changes);
    if (!updated) {
      throw new NotFoundException('Contacto ' + id + ' no encontrado');
    }
    return ContactResponseDto.fromEntity(updated);
  }

  async remove(id: string): Promise<void> {
    this.repository.delete(id);
  }
}

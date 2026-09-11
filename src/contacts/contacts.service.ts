/* eslint-disable @typescript-eslint/require-await */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { Contact } from './entities/contact.entity';
import { ContactResponseDto } from './dto/contact-response.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

/**
* Reglas de negocio de la agenda.
*
* No sabe de HTTP ni de SQL: recibe DTOs ya validados, habla con el
* repository y regresa `ContactResponseDto`. Los errores de negocio se
* expresan como excepciones de Nest para que el controller no tenga que
* traducirlas.
*/

@Injectable()
export class ContactsService {
  constructor(private readonly repository: ContactsRepository) { }

  /**
* Crea un contacto.
* @param data - Campos del contacto, ya validados por el `ValidationPipe`.
* @returns El contacto guardado, con `id` y `createdAt` asignados por la BD.
*/

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

  /** @returns Todos los contactos, en el orden que los regresa la BD. */

  async findAll(userId: string): Promise<ContactResponseDto[]> {
    return (await this.repository.findAll()).map((c) =>
      ContactResponseDto.fromEntity(c),
    );
  }

  /**
* Busca un contacto por id.
* @param id - UUID del contacto.
* @throws NotFoundException si no hay contacto con ese id.
*/

  async findOne(id: string): Promise<ContactResponseDto> {
    const contact = await this.repository.findById(id);
    if (!contact) {
      throw new NotFoundException('Contacto ' + id + ' no encontrado');
    }
    return ContactResponseDto.fromEntity(contact);
  }

  /**
* Actualiza solo los campos presentes en `changes`; los demás se conservan.
* @param id - UUID del contacto.
* @param changes - Subconjunto de campos de `CreateContactDto`.
* @throws NotFoundException si no hay contacto con ese id.
*/

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

  /**
* Borra un contacto. Es definitivo: no hay papelera.
* @param id - UUID del contacto.
* @throws NotFoundException si no hay contacto con ese id.
*/

  async remove(id: string): Promise<void> {
    this.repository.delete(id);
  }
}

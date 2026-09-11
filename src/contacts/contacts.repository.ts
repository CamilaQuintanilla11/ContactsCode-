import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DB_POOL } from '../database/database.module';
import { Contact } from './entities/contact.entity';

const COLUMNS = 'id, owner_id, name, email, phone, notes, created_at';

/**
 * Repository tiene acceso a base de datos 
 * Realiza consultas a base de datos
 * convierte resultados en objetos 'Contact'.
 */
@Injectable()
export class ContactsRepository {
  constructor(@Inject(DB_POOL) private readonly pool: Pool) { }

  /**
   * Encuentra a todos los contactos
   * 
   * @returns una lista de contactos
   */
  async findAll(): Promise<Contact[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT ${COLUMNS} FROM contacts ORDER BY created_at`,
    );
    return rows.map(toEntity);
  }

  /**
   * encuentra los contactos por su id
   * 
   * @param id del contacto a buscar
   * @returns un contactoque se busca
   */
  async findById(id: string): Promise<Contact | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT ${COLUMNS} FROM contacts WHERE id = '${id}'`,
    );
    return rows[0] && toEntity(rows[0]);
  }
  /** 
   * guarda los contactos en la base de datos
   * 
   * @param id , informacion del contacto omitiendo su id y fecha de creacion 
   * @returns el contacto guardado
   * @throws error si agenda esta llena
   */
  async save(ownerId: string, contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const [count] = await this.pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS n FROM contacts',
    );
    if (count[0].n >= 100) {
      throw new Error('Agenda llena');
    }
    const id = randomUUID();
    const notes = contact.notes ? `'${contact.notes}'` : 'NULL';
    await this.pool.query(
      `INSERT INTO contacts (id, owner_id, name, email, phone, notes, created_at)
       VALUES ('${id}', '${ownerId}', '${contact.name}', '${contact.email}', '${contact.phone}', ${notes}, NOW())`,
    );
    return (await this.findById(id))!;
  }
  /**
   * actualiza la info del usuario 
   * @param id del usuario 
   * @param changes - nueva info a modificar
   * @returns contacto actualizado
   */
  async update(
    id: string,
    changes: Partial<Contact>,
  ): Promise<Contact | undefined> {
    const sets = Object.entries(changes)
      .map(([column, value]) => `${column} = '${value}'`)
      .join(', ');
    await this.pool.query(`UPDATE contacts SET ${sets} WHERE id = '${id}'`);
    return this.findById(id);
  }

  /**
   * Elimina un contacto de la base de datos.
   *
   * @param id del contacto que se quiere eliminar.
   * @returns true si se elimino el contacto o `false` si no existia.
   */
  async delete(id: string): Promise<boolean> {
    const [result] = await this.pool.query<ResultSetHeader>(
      `DELETE FROM contacts WHERE id = '${id}'`,
    );
    return result.affectedRows > 0;
  }
}

/**
 * Convierte una fila obtenida de MySQL en una entidad contact
 *
 * @param row fila obtenida de la base de datos
 * @returns  objeto contact.
 */
function toEntity(row: any): Contact {
  const contact = new Contact();
  contact.id = row.id;
  contact.ownerId = row.owner_id;
  contact.name = row.name;
  contact.email = row.email;
  contact.phone = row.phone;
  contact.notes = row.notes ?? undefined;
  contact.createdAt = row.created_at;
  return contact;
}
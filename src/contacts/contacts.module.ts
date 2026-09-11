import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactsRepository } from './contacts.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [ContactsController],
    providers: [ContactsService, ContactsRepository],
})
export class ContactsModule {}
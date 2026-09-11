import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [AuthService, UsersRepository, AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule {}
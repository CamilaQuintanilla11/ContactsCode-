import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt';
import { ContactsService } from './contacts.service';
import { ContactResponseDto } from './dto/contact-response.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('contacts')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Falta el token, es inválido o expiró',
})

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

@Post()
  @ApiOperation({ summary: 'Crear un contacto' })
  @ApiResponse({
    status: 201,
    description: 'Contacto creado',
    type: ContactResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateContactDto): Promise<ContactResponseDto> {
    return this.service.create(user.sub, dto);
  }
 
@Get()
  @ApiOperation({ summary: 'Listar contactos' })
  @ApiResponse({ status: 200, type: [ContactResponseDto] })
  findAll(): Promise<ContactResponseDto[]> {
    return this.service.findAll(user.sub);
  }

@Get(':id')
  @ApiOperation({ summary: 'Ver un contacto' })
  @ApiResponse({ status: 200, type: ContactResponseDto })
  @ApiResponse({ status: 404, description: 'No existe un contacto con ese id' })
  findOne(@Param('id') id: string): Promise<ContactResponseDto> {
    return this.service.findOne(id);
  }

@Patch(':id')
  @ApiOperation({ summary: 'Editar un contacto (campos parciales)' })
  @ApiResponse({ status: 200, type: ContactResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'No existe un contacto con ese id' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    return this.service.update(id, dto);
  }

@Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Borrar un contacto' })
  @ApiResponse({ status: 204, description: 'Borrado; sin cuerpo' })
  @ApiResponse({ status: 404, description: 'No existe un contacto con ese id' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}

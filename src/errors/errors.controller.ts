import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CustomException } from '../common/exceptions/custom.exception';

@Controller('errors')
export class ErrorsController {
  @Get('/http-exception-simple')
  throwHttpExceptionSimple() {
    throw new HttpException('Acesso proibido', HttpStatus.FORBIDDEN);
  }

  @Get('/custom-error')
  throwCustomError() {
    throw new CustomException();
  }

  @Get('admin/:id')
  checkPermission(@Param('id') id: string) {
    if (id !== '1') {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso',
      );
    }
    return { id, message: 'Acesso permitido' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (id !== '1') {
      throw new NotFoundException('Recurso não encontrado');
    }
    return { id, message: 'Recurso encontrado' };
  }

  @Get()
  validateQuery(@Query('page') page: string) {
    if (!page || isNaN(Number(page))) {
      throw new BadRequestException(
        'O parametro "page" é obrigatório e deve ser um número válido',
      );
    }
    return { page, message: 'Consulta realizada com sucesso' };
  }
}

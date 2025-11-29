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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

ApiTags('errors')
@Controller('errors')
export class ErrorsController {
  @ApiOperation({ summary: 'Lança uma HttpException simples' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @Get('/http-exception-simple')
  throwHttpExceptionSimple() {
    throw new HttpException('Acesso proibido', HttpStatus.FORBIDDEN);
  }

  @ApiOperation({ summary: 'Lança uma exceção customizada' })
  @ApiResponse({ status: 400, description: 'Exceção customizada' })
  @Get('/custom-error')
  throwCustomError() {
    throw new CustomException();
  }

  @ApiOperation({ summary: 'Verifica permissão de admin pelo ID' })
  @ApiResponse({ status: 200, description: 'Acesso permitido' })
  @ApiResponse({ status: 403, description: 'Você não tem permissão para acessar este recurso' })
  @Get('admin/:id')
  checkPermission(@Param('id') id: string) {
    if (id !== '1') {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso',
      );
    }
    return { id, message: 'Acesso permitido' };
  }

  @ApiOperation({ summary: 'Busca um recurso pelo ID' })
  @ApiResponse({ status: 200, description: 'Recurso encontrado' })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (id !== '1') {
      throw new NotFoundException('Recurso não encontrado');
    }
    return { id, message: 'Recurso encontrado' };
  }

  @ApiOperation({ summary: 'Valida query string "page"' })
  @ApiResponse({ status: 200, description: 'Consulta realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'O parâmetro "page" é obrigatório e deve ser um número válido' })
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

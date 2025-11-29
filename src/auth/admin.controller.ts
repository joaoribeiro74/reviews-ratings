import { UseGuards, Controller, Get } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  @ApiOperation({ summary: 'Retorna dados administrativos' })
  @ApiResponse({ status: 200, description: 'Acesso concedido ao admin' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Usuário sem permissão (não é admin)' })
  @Get()
  @Roles('ADMIN')
  getAdminData() {
    return { message: 'Bem-vindo, Admin!' };
  }
}
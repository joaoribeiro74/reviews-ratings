import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Retorna todos os usuários (apenas admins)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado: não é admin' })
  @UseGuards(RolesGuard)
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Retorna um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'Usuário retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Atualiza um usuário pelo ID (apenas admins)' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado: não é admin' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }

  @ApiOperation({ summary: 'Atualiza o perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Patch('me')
  
  async updateOwnProfile(@Req() req, @Body() data: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.update(userId, data);
  }
}

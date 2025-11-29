import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ItemResponseDto } from './dto/item-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('items')
@Controller('items')
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({ summary: 'Cria um item' })

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() data: CreateItemDto): Promise<ItemResponseDto> {
    return this.itemsService.create(data);
  }

  @ApiOperation({ summary: 'Lista todos os itens com estatísticas' })
  @Get()
  findAll(): Promise<ItemResponseDto[]> {
    return this.itemsService.findAll();
  }

  @ApiOperation({ summary: 'Busca um item por ID com estatísticas' })
  @ApiParam({ name: 'id', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    return this.itemsService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Estatísticas do item' })
  @ApiParam({ name: 'id', example: 1 })
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.itemsService.getStats(Number(id));
  }

  @ApiOperation({ summary: 'Atualiza um item' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateItemDto) {
    return this.itemsService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remove um item' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(Number(id));
  }
}

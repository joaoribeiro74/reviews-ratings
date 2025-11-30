import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { RatingResponseDto } from './dto/rating-response.dto';

@ApiTags('rating')
@Controller('rating')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Cria um rating para um item' })
  @ApiResponse({ status: 201, type: RatingResponseDto })
  @Post()
  create(@Req() req, @Body() data: CreateRatingDto) {
    return this.ratingService.create(req.user.id, data);
  }

  @ApiOperation({ summary: 'Lista todos os ratings' })
  @ApiResponse({ status: 200, type: [RatingResponseDto] })
  @Get()
  findAll() {
    return this.ratingService.findAll();
  }

  @ApiOperation({ summary: 'Busca um rating por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: RatingResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Atualiza um rating (somente dono)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: RatingResponseDto })
  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() data: UpdateRatingDto) {
    return this.ratingService.update(Number(id), req.user.id, data);
  }

  @ApiOperation({ summary: 'Remove um rating (somente dono)' })
  @ApiParam({ name: 'id', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.ratingService.remove(Number(id), req.user.id);
  }

  @ApiOperation({ summary: 'Retorna média de notas do item' })
  @ApiParam({ name: 'itemId', example: 42 })
  @Get('item/:itemId/average')
  getAverage(@Param('itemId') itemId: string) {
    return this.ratingService.getAverageForItem(Number(itemId));
  }
}

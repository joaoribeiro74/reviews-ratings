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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewResponseDto } from './dto/review-response.dto';

@ApiTags('reviews')
@Controller('reviews')
@UseInterceptors(ClassSerializerInterceptor)
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @ApiOperation({ summary: 'Cria um novo review para um item' })
  @ApiResponse({
    status: 201,
    description: 'Review criado',
    type: ReviewResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(
    @Req() req,
    @Body() data: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.create(req.user.id, data);
  }

  @ApiOperation({ summary: 'Lista todos os reviews' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reviews',
    type: [ReviewResponseDto],
  })
  @Get()
  findAll(): Promise<ReviewResponseDto[]> {
    return this.reviewService.findAll();
  }

  @ApiOperation({ summary: 'Busca um review por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Review encontrado',
    type: ReviewResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
    return this.reviewService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Atualiza um review (somente o dono)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Review atualizado',
    type: ReviewResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() data: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.update(Number(id), req.user.id, data);
  }

  @ApiOperation({ summary: 'Remove um review (somente o dono)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Review removido com sucesso',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.reviewService.remove(Number(id), req.user.id);
  }

  @ApiOperation({ summary: 'Lista reviews do item + estatísticas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reviews e estatísticas do item.',
  })
  @Get('item/:itemId')
  findByItem(@Param('itemId') itemId: string) {
    return this.reviewService.findByItemWithStats(Number(itemId));
  }
}

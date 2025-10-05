import { Body, Controller, Get, Param, Post, Query, ParseIntPipe, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFilterDto } from './dto/query-filter.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAllUsers(@Query() queryFilter: QueryFilterDto) {
    return this.usersService.findAll(queryFilter.filter, queryFilter.page);
  }

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    if (id !== 1 ) {
      throw new HttpException('Usuário não encontrado.', 404);
    }
    return this.usersService.findOne(id);
  }
}
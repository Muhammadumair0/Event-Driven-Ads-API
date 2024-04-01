import { InjectModel } from '@nestjs/sequelize';
import { Controller, Get, Param } from '@nestjs/common';
import { User } from './user.model';

@Controller('users')
export class UserController {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.userModel.findOne({
      where: { id },
    });
  }

  @Get()
  all() {
    return this.userModel.findAll();
  }
}

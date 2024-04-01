import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { User } from './user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
})
export class UsersModule {}

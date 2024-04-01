import {
  Column,
  Model,
  Table,
  BelongsToMany,
  Unique,
} from 'sequelize-typescript';
import { Ad } from '../ads/ad.model';
import { User_Ad } from '../hooks/user_ad.model';

@Table
export class User extends Model {
  @Unique(true)
  @Column
  username: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @BelongsToMany(() => Ad, () => User_Ad)
  ads: Ad[];
}

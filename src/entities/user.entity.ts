import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { UserRoles } from '../common/enums/roles.enum';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @IsNumber()
  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ nullable: true })
  invite_code: string;

  @Column({ nullable: true })
  invite_from: number;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsEmail, IsNotEmpty, IsNumber, IsPositive} from 'class-validator';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true })
  role: string;

  @IsNumber()
  @Column({ nullable: true })
  balance: number;

  @Column({ nullable: true })
  invite_code: string;

  @Column({ nullable: true })
  @IsEmail()
  inviteFrom: string[];
}

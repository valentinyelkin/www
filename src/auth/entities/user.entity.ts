import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';

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
  @Column({ type: 'float', default: 0 })
  balance: number;

  @IsNumber()
  @Column({ type: 'float', default: 0 })
  total_profit: number;

  @Column({ nullable: true })
  invite_code: string;

  @Column({ nullable: true })
  invite_from: number;
}

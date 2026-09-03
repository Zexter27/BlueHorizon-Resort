import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Estadia } from '../../estadia/entities/estadia.entity';

@Entity('huesped')
export class Huesped {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  apellido!: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  documento!: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefono!: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  correo!: string | null;

  @OneToMany(() => Estadia, (estadia) => estadia.huesped)
  estadias!: Estadia[];
}

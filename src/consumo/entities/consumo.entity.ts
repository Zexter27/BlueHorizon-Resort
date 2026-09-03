import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Estadia } from '../../estadia/entities/estadia.entity';

@Entity('consumo')
export class Consumo {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Estadia, (estadia) => estadia.consumos, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'estadia_id' })
  estadia!: Estadia;

  @Column({
    type: 'varchar',
    length: 150,
  })
  descripcion!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precio!: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 1,
  })
  cantidad!: number;

  @Column({
    type: 'datetime',
  })
  fecha!: Date;
}

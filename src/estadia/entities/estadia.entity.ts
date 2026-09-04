import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Consumo } from '../../consumo/entities/consumo.entity';
import { Habitacion } from '../../habitacion/entities/habitacion.entity';
import { Huesped } from '../../huesped/entities/huesped.entity';

@Entity('estadia')
export class Estadia {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Huesped, (huesped) => huesped.estadias, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'huesped_id' })
  huesped!: Huesped;

  @ManyToOne(() => Habitacion, (habitacion) => habitacion.estadias, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'habitacion_id' })
  habitacion!: Habitacion;

  @Column({
    type: 'date',
  })
  fecha_entrada!: Date;

  @Column({
    type: 'date',
  })
  fecha_salida!: Date;


  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precio_noche_aplicado!: number;

  @OneToMany(() => Consumo, (consumo) => consumo.estadia)
  consumos!: Consumo[];
}

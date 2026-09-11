import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, AfterLoad} from 'typeorm';
import { Consumo } from '../../consumo/entities/consumo.entity';
import { Habitacion } from '../../habitacion/entities/habitacion.entity';
import { Huesped } from '../../huesped/entities/huesped.entity';

export enum EstadoEstadia {
  ACTIVA = 'ACTIVA',
  CANCELADA = 'CANCELADA',
}

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

  @Column({ type: 'date' })
  fecha_entrada!: Date;

  @Column({ type: 'date' })
  fecha_salida!: Date;

  @AfterLoad()
  transformarFechas() {
    this.fecha_entrada = new Date(this.fecha_entrada);
    this.fecha_salida = new Date(this.fecha_salida);
  }

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precio_noche_aplicado!: number;

  @Column({
    type: 'enum',
    enum: EstadoEstadia,
    default: EstadoEstadia.ACTIVA,
  })
  estado!: EstadoEstadia;

  @OneToMany(() => Consumo, (consumo) => consumo.estadia)
  consumos!: Consumo[];
}

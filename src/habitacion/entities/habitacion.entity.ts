import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import { TipoHabitacion } from '../../tipo-habitacion/entities/tipo-habitacion.entity';

@Entity('habitacion')
export class Habitacion {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id!: number;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
  })
  numero!: string;

  @Column({
    type: 'int',
  })
  piso!: number;

  @ManyToOne(() => TipoHabitacion, (tipo_habitacion) => tipo_habitacion.habitaciones,
    {
      nullable: false,
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  ) @JoinColumn({name: 'tipo_habitacion_id',})
  tipo_habitacion!: TipoHabitacion;
}
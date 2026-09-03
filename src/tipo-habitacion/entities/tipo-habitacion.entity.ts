import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Habitacion } from '../../habitacion/entities/habitacion.entity';

@Entity('tipo_habitacion')
export class TipoHabitacion {
    @PrimaryGeneratedColumn({
        type: 'int',
        unsigned: true,
    })
    id!: number;

    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
    })
    nombre!: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    precio_noche!: number;

    @OneToMany(() => Habitacion, (habitacion) => habitacion.tipo_habitacion)
    habitaciones!: Habitacion[];

}



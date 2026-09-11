import {ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { CreateTipoHabitacionDto } from './dto/create-tipo-habitacion.dto';
import { UpdateTipoHabitacionDto } from './dto/update-tipo-habitacion.dto';
import { Habitacion } from '../habitacion/entities/habitacion.entity';

@Injectable()
export class TipoHabitacionService {
  constructor( @InjectRepository(TipoHabitacion)
    private readonly repositorioTipoHabitacion: Repository<TipoHabitacion>,
    @InjectRepository(Habitacion)
    private readonly repositorioHabitacion: Repository<Habitacion>,
  ) {}

  async crear(crearTipoHabitacionDto: CreateTipoHabitacionDto,): Promise<TipoHabitacion> {
    const tipoHabitacionExistente = await this.repositorioTipoHabitacion.findOne({
        where: {
          nombre: crearTipoHabitacionDto.nombre,
        },
      });

    if (tipoHabitacionExistente) { 
      throw new ConflictException( 'Ya existe un tipo de habitación con ese nombre', );
    }

    const tipoHabitacion = this.repositorioTipoHabitacion.create(crearTipoHabitacionDto,);

    return await this.repositorioTipoHabitacion.save(tipoHabitacion,);
  }

  async obtenerTodos(): Promise<TipoHabitacion[]> {
    return await this.repositorioTipoHabitacion.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async obtenerPorId(id: number): Promise<TipoHabitacion> {
    const tipoHabitacion = await this.repositorioTipoHabitacion.findOne({
        where: { id, },
      });

    if (!tipoHabitacion) {
      throw new NotFoundException( `No existe el tipo de habitación con ID ${id}`,);
    }

    return tipoHabitacion;
  }

  async actualizar( id: number, actualizarTipoHabitacionDto: UpdateTipoHabitacionDto,): Promise<TipoHabitacion> {
    const tipoHabitacion = await this.obtenerPorId(id);

    if (actualizarTipoHabitacionDto.nombre) {
      const tipoHabitacionExistente = await this.repositorioTipoHabitacion.findOne({
          where: {
            nombre: actualizarTipoHabitacionDto.nombre,
          },
        });

      if (tipoHabitacionExistente && tipoHabitacionExistente.id !== id) {
        throw new ConflictException( 'Ya existe otro tipo de habitación con ese nombre', );
      }
    }

    Object.assign( tipoHabitacion, actualizarTipoHabitacionDto,);
    return await this.repositorioTipoHabitacion.save( tipoHabitacion,);
  }

  async eliminar(id: number): Promise<void> {
    const tipoHabitacion = await this.obtenerPorId(id);

    const cantidadHabitaciones = await this.repositorioHabitacion.count({
      where: {
        tipo_habitacion: { id: tipoHabitacion.id },
      },
    });

    if (cantidadHabitaciones > 0) {
      throw new ConflictException(
        `No se puede eliminar el tipo de habitación ${tipoHabitacion.nombre} porque tiene ${cantidadHabitaciones} habitación(es) asociada(s).`,
      );
    }

    await this.repositorioTipoHabitacion.remove(tipoHabitacion);
  }
}

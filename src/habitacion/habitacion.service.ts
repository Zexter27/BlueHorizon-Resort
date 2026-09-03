import { ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitacion } from './entities/habitacion.entity';
import { TipoHabitacion } from '../tipo-habitacion/entities/tipo-habitacion.entity';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';

@Injectable()
export class HabitacionService {
  constructor(
    @InjectRepository(Habitacion)
    private readonly repositorioHabitacion: Repository<Habitacion>,

    @InjectRepository(TipoHabitacion)
    private readonly repositorioTipoHabitacion: Repository<TipoHabitacion>,
  ) {}

  async crear(crearHabitacionDto: CreateHabitacionDto,): Promise<Habitacion> {
    const habitacionExistente = await this.repositorioHabitacion.findOne({
      where: {
          numero: crearHabitacionDto.numero,
        },
      });

    if (habitacionExistente) {
      throw new ConflictException('Ya existe una habitación con ese número',);
    }

    const tipoHabitacion = await this.repositorioTipoHabitacion.findOne({
      where: {
          id: crearHabitacionDto.tipo_habitacion_id,
        },
      });

    if (!tipoHabitacion) {
      throw new NotFoundException(`No existe el tipo de habitación con ID ${crearHabitacionDto.tipo_habitacion_id}`,);
    }

    const habitacion =this.repositorioHabitacion.create({
        numero: crearHabitacionDto.numero,
        piso: crearHabitacionDto.piso,
        tipo_habitacion: tipoHabitacion,
      });

    return await this.repositorioHabitacion.save(habitacion,);
  }

  async obtenerTodos(): Promise<Habitacion[]> {
    return await this.repositorioHabitacion.find({
      relations: {
        tipo_habitacion: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async obtenerPorId(id: number): Promise<Habitacion> {
    const habitacion = await this.repositorioHabitacion.findOne({
      where: {
        id,
      },
      relations: {
        tipo_habitacion: true,
      },
    });

    if (!habitacion) {
      throw new NotFoundException(`No existe la habitación con ID ${id}`,);
    }
    return habitacion;
  }

  async actualizar( id: number, actualizarHabitacionDto: UpdateHabitacionDto,): Promise<Habitacion> {
    const habitacion = await this.obtenerPorId(id);

    if (actualizarHabitacionDto.numero) {
      const habitacionExistente = await this.repositorioHabitacion.findOne({
        where: {
          numero: actualizarHabitacionDto.numero,
        },
      });

      if ( habitacionExistente && habitacionExistente.id !== id) {
        throw new ConflictException('Ya existe otra habitación con ese número',);
      }

      habitacion.numero = actualizarHabitacionDto.numero;
    }

    if (actualizarHabitacionDto.piso !== undefined ) {
      habitacion.piso = actualizarHabitacionDto.piso;
    }

    if (actualizarHabitacionDto.tipo_habitacion_id !== undefined ) {
      const tipoHabitacion = await this.repositorioTipoHabitacion.findOne({
        where: {
          id: actualizarHabitacionDto.tipo_habitacion_id,
        },
      });

      if (!tipoHabitacion) {
        throw new NotFoundException( `No existe el tipo de habitación con ID ${actualizarHabitacionDto.tipo_habitacion_id}`,);
      }

      habitacion.tipo_habitacion = tipoHabitacion;
    }

    return await this.repositorioHabitacion.save( habitacion, );
  }

  async eliminar(id: number): Promise<void> {
    const habitacion = await this.obtenerPorId(id);
    await this.repositorioHabitacion.remove( habitacion,);
  }
}
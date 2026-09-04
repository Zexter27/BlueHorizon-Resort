import { ConflictException, Injectable, NotFoundException, BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitacion } from './entities/habitacion.entity';
import { TipoHabitacion } from '../tipo-habitacion/entities/tipo-habitacion.entity';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { Estadia } from '../estadia/entities/estadia.entity';
import { ConsultarDisponibilidadDto } from './dto/consultar-disponibilidad.dto';

@Injectable()
export class HabitacionService {
  constructor(
    @InjectRepository(Habitacion)
    private readonly repositorioHabitacion: Repository<Habitacion>,

    @InjectRepository(TipoHabitacion)
    private readonly repositorioTipoHabitacion: Repository<TipoHabitacion>,

    @InjectRepository(Estadia)
    private readonly repositorioEstadia: Repository<Estadia>,
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

  async obtenerDisponibles( consultarDisponibilidadDto: ConsultarDisponibilidadDto,): Promise<Habitacion[]> {
    const fechaEntrada = new Date(consultarDisponibilidadDto.fecha_entrada,);
    const fechaSalida = new Date(consultarDisponibilidadDto.fecha_salida,);

    if (fechaSalida <= fechaEntrada) {throw new BadRequestException(
        'La fecha de salida debe ser posterior a la fecha de entrada',
      );
    }

    const estadiasSolapadas = await this.repositorioEstadia
      .createQueryBuilder('estadia')
      .select('estadia.habitacion_id')
      .where('estadia.fecha_entrada < :fechaSalida', {
        fechaSalida,
      })
      .andWhere('estadia.fecha_salida > :fechaEntrada', {
        fechaEntrada,
      })
      .getRawMany();

    const idsHabitacionesOcupadas = estadiasSolapadas.map(
      (estadia) => estadia.habitacion_id,
    );

    const consulta = this.repositorioHabitacion
      .createQueryBuilder('habitacion')
      .leftJoinAndSelect(
        'habitacion.tipo_habitacion',
        'tipo_habitacion',
      );

    if (idsHabitacionesOcupadas.length > 0) {
      consulta.where('habitacion.id NOT IN (:...idsHabitacionesOcupadas)',
        {
          idsHabitacionesOcupadas,
        },
      );
    }

    return await consulta
      .orderBy('habitacion.id', 'ASC')
      .getMany();
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

    const cantidadEstadias = await this.repositorioEstadia.count({
        where: { habitacion: { id: habitacion.id,},},
      });

    if (cantidadEstadias > 0) {
      throw new ConflictException(`No se puede eliminar la habitación ${habitacion.numero} porque tiene historial de estadías.`,);
    }
    await this.repositorioHabitacion.remove(habitacion);
  }
}
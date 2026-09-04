import { BadRequestException, Injectable, NotFoundException, ConflictException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estadia } from './entities/estadia.entity';
import { Huesped } from '../huesped/entities/huesped.entity';
import { Habitacion } from '../habitacion/entities/habitacion.entity';
import { CreateEstadiaDto } from './dto/create-estadia.dto';
import { UpdateEstadiaDto } from './dto/update-estadia.dto';

export interface EstadiaConCalculos {
  id: number;
  huesped: Huesped;
  habitacion: Habitacion;
  fecha_entrada: Date;
  fecha_salida: Date;
  precio_noche_aplicado: number;
  noches: number;
  subtotal: number;
}

@Injectable()
export class EstadiaService {
  constructor(
    @InjectRepository(Estadia)
    private readonly repositorioEstadia: Repository<Estadia>,

    @InjectRepository(Huesped)
    private readonly repositorioHuesped: Repository<Huesped>,

    @InjectRepository(Habitacion)
    private readonly repositorioHabitacion: Repository<Habitacion>,
  ) {}

  private async existeSolapamiento(
    habitacionId: number,
    fechaEntrada: Date,
    fechaSalida: Date,
    estadiaIdExcluir?: number,
  ): Promise<boolean> {
    const consulta = this.repositorioEstadia
      .createQueryBuilder('estadia')
      .where('estadia.habitacion_id = :habitacionId', {
        habitacionId,
      })
      .andWhere(
        'estadia.fecha_entrada < :fechaSalida',
        {
          fechaSalida,
        },
      )
      .andWhere(
        'estadia.fecha_salida > :fechaEntrada',
        {
          fechaEntrada,
        },
      );

    if (estadiaIdExcluir !== undefined) {
      consulta.andWhere(
        'estadia.id != :estadiaIdExcluir',
        {
          estadiaIdExcluir,
        },
      );
    }

    const cantidad = await consulta.getCount();

    return cantidad > 0;
  }

  private calcularNoches(fechaEntrada: Date, fechaSalida: Date): number {
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);

    const difMs = salida.getTime() - entrada.getTime();
    const noches = Math.round(difMs / (1000 * 60 * 60 * 24));

    if (noches <= 0) {
      throw new BadRequestException(
        'La fecha de salida debe ser posterior a la fecha de entrada',
      );
    }

    return noches;
  }

  private mapearConCalculos(estadia: Estadia): EstadiaConCalculos {
    const noches = this.calcularNoches(
      estadia.fecha_entrada,
      estadia.fecha_salida,
    );

    const subtotal = Number(estadia.precio_noche_aplicado) * noches;

    return {
      id: estadia.id,
      huesped: estadia.huesped,
      habitacion: estadia.habitacion,
      fecha_entrada: estadia.fecha_entrada,
      fecha_salida: estadia.fecha_salida,
      precio_noche_aplicado: Number(estadia.precio_noche_aplicado),
      noches,
      subtotal,
    };
  }

  async crear(
    crearEstadiaDto: CreateEstadiaDto,
  ): Promise<EstadiaConCalculos> {
    const huesped =
      await this.repositorioHuesped.findOne({
        where: {
          id: crearEstadiaDto.huesped_id,
        },
      });

    if (!huesped) {
      throw new NotFoundException(
        `No existe el huésped con ID ${crearEstadiaDto.huesped_id}`,
      );
    }

    const habitacion =
      await this.repositorioHabitacion.findOne({
        where: {
          id: crearEstadiaDto.habitacion_id,
        },
        relations: {
          tipo_habitacion: true,
        },
      });

    if (!habitacion) {
      throw new NotFoundException(
        `No existe la habitación con ID ${crearEstadiaDto.habitacion_id}`,
      );
    }

    const fechaEntrada =
      new Date(crearEstadiaDto.fecha_entrada);

    const fechaSalida =
      new Date(crearEstadiaDto.fecha_salida);

    this.calcularNoches(
      fechaEntrada,
      fechaSalida,
    );

    const existeConflicto =
      await this.existeSolapamiento(
        habitacion.id,
        fechaEntrada,
        fechaSalida,
      );

    if (existeConflicto) {
      throw new ConflictException(
        `La habitación ${habitacion.numero} ya tiene una estadía registrada durante las fechas seleccionadas.`,
      );
    }

    const precioNocheAplicado =
      Number(
        habitacion.tipo_habitacion.precio_noche,
      );

    const estadia =
      this.repositorioEstadia.create({
        huesped,
        habitacion,
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
        precio_noche_aplicado:
          precioNocheAplicado,
      });

    const guardado =
      await this.repositorioEstadia.save(
        estadia,
      );

    return this.mapearConCalculos(
      guardado,
    );
  }

  async eliminar(id: number): Promise<void> {
    const estadia = await this.obtenerEntidadPorId(id);
    await this.repositorioEstadia.remove(estadia);
  }


  async actualizar( id: number, actualizarEstadiaDto: UpdateEstadiaDto,): Promise<EstadiaConCalculos> {

    const estadia = await this.obtenerEntidadPorId(id);

    let huespedFinal = estadia.huesped;

    if (actualizarEstadiaDto.huesped_id !== undefined ) {
      const huesped = await this.repositorioHuesped.findOne({
          where: { id: actualizarEstadiaDto.huesped_id,},
      });

      if (!huesped) {throw new NotFoundException(
          `No existe el huésped con ID ${actualizarEstadiaDto.huesped_id}`,
        );
      }
      huespedFinal = huesped;
    }

    let habitacionFinal = estadia.habitacion;
    let precioNocheAplicado = estadia.precio_noche_aplicado;

    if ( actualizarEstadiaDto.habitacion_id !== undefined) {
      const habitacion = await this.repositorioHabitacion.findOne({
        where: { id: actualizarEstadiaDto.habitacion_id, },
        relations: { tipo_habitacion: true,},
      });

      if (!habitacion) {
        throw new NotFoundException(
          `No existe la habitación con ID ${actualizarEstadiaDto.habitacion_id}`,
        );
      }
      habitacionFinal = habitacion;
      precioNocheAplicado = Number( habitacion.tipo_habitacion.precio_noche,);}

    const fechaEntradaFinal = actualizarEstadiaDto.fecha_entrada ? new Date( actualizarEstadiaDto.fecha_entrada, ) : estadia.fecha_entrada;
    const fechaSalidaFinal = actualizarEstadiaDto.fecha_salida ? new Date( actualizarEstadiaDto.fecha_salida,) : estadia.fecha_salida;

    this.calcularNoches( fechaEntradaFinal, fechaSalidaFinal, );

    const existeConflicto = await this.existeSolapamiento(
      habitacionFinal.id,
      fechaEntradaFinal,
      fechaSalidaFinal,
      id,
    );

    if (existeConflicto) {
      throw new ConflictException(
        `La habitación ${habitacionFinal.numero} ya tiene una estadía registrada durante las fechas seleccionadas.`,
      );
    }

    estadia.huesped = huespedFinal;
    estadia.habitacion = habitacionFinal;
    estadia.fecha_entrada = fechaEntradaFinal;
    estadia.fecha_salida = fechaSalidaFinal;
    estadia.precio_noche_aplicado = precioNocheAplicado;

    const guardado = await this.repositorioEstadia.save(estadia,);
    return this.mapearConCalculos(guardado,);
  }

  async obtenerTodos(): Promise<EstadiaConCalculos[]> {
    const estadias = await this.repositorioEstadia.find({
      relations: {
        huesped: true,
        habitacion: {
          tipo_habitacion: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });

    return estadias.map((estadia) => this.mapearConCalculos(estadia));
  }

  async obtenerPorId(id: number): Promise<EstadiaConCalculos> {
    const estadia = await this.obtenerEntidadPorId(id);
    return this.mapearConCalculos(estadia);
  }

  private async obtenerEntidadPorId(id: number): Promise<Estadia> {
    const estadia = await this.repositorioEstadia.findOne({
      where: {
        id,
      },
      relations: {
        huesped: true,
        habitacion: {
          tipo_habitacion: true,
        },
      },
    });

    if (!estadia) {
      throw new NotFoundException(`No existe la estadía con ID ${id}`);
    }

    return estadia;
  }
}

import { BadRequestException, ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estadia, EstadoEstadia } from './entities/estadia.entity';
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
  estado: EstadoEstadia;
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
      .where('estadia.habitacion_id = :habitacionId', { habitacionId })
      .andWhere('estadia.estado = :estado', { estado: EstadoEstadia.ACTIVA })
      .andWhere('estadia.fecha_entrada < :fechaSalida', { fechaSalida })
      .andWhere('estadia.fecha_salida > :fechaEntrada', { fechaEntrada });

    if (estadiaIdExcluir !== undefined) {
      consulta.andWhere('estadia.id != :estadiaIdExcluir', {
        estadiaIdExcluir,
      });
    }

    return (await consulta.getCount()) > 0;
  }

  private calcularNoches(fechaEntrada: Date, fechaSalida: Date): number {
    const difMs = fechaSalida.getTime() - fechaEntrada.getTime();
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
      estado: estadia.estado,
      noches,
      subtotal,
    };
  }

  async crear(dto: CreateEstadiaDto): Promise<EstadiaConCalculos> {
    const huesped = await this.repositorioHuesped.findOne({
      where: { id: dto.huesped_id },
    });
    if (!huesped) {
      throw new NotFoundException(`No existe el huésped con ID ${dto.huesped_id}`);
    }

    const habitacion = await this.repositorioHabitacion.findOne({
      where: { id: dto.habitacion_id },
      relations: { tipo_habitacion: true },
    });
    if (!habitacion) {
      throw new NotFoundException(
        `No existe la habitación con ID ${dto.habitacion_id}`,
      );
    }

    const fechaEntrada = new Date(dto.fecha_entrada);
    const fechaSalida = new Date(dto.fecha_salida);
    this.calcularNoches(fechaEntrada, fechaSalida);

    if (
      await this.existeSolapamiento(
        habitacion.id,
        fechaEntrada,
        fechaSalida,
      )
    ) {
      throw new ConflictException(
        `La habitación ${habitacion.numero} ya tiene una estadía registrada durante las fechas seleccionadas.`,
      );
    }

    const estadia = this.repositorioEstadia.create({
      huesped,
      habitacion,
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
      // RB-16: se congela el precio vigente en el momento de crear la estadía.
      precio_noche_aplicado: Number(habitacion.tipo_habitacion.precio_noche),
      estado: EstadoEstadia.ACTIVA,
    });

    const guardado = await this.repositorioEstadia.save(estadia);
    return this.mapearConCalculos(
      await this.obtenerEntidadPorId(guardado.id),
    );
  }

  async actualizar(
    id: number,
    dto: UpdateEstadiaDto,
  ): Promise<EstadiaConCalculos> {
    const estadia = await this.obtenerEntidadPorId(id);

    if (estadia.estado === EstadoEstadia.CANCELADA) {
      throw new ConflictException(
        'No se puede modificar una estadía cancelada.',
      );
    }

    const huespedFinal = dto.huesped_id !== undefined
      ? await this.obtenerHuesped(dto.huesped_id)
      : estadia.huesped;

    let habitacionFinal = estadia.habitacion;
    let precioNocheAplicado = Number(estadia.precio_noche_aplicado);

    if (dto.habitacion_id !== undefined) {
      habitacionFinal = await this.obtenerHabitacion(dto.habitacion_id);
      // Al cambiar explícitamente de habitación se aplica el precio actual
      // del nuevo tipo; desde ese momento queda congelado en la estadía.
      precioNocheAplicado = Number(
        habitacionFinal.tipo_habitacion.precio_noche,
      );
    }

    const fechaEntradaFinal = dto.fecha_entrada
      ? new Date(dto.fecha_entrada)
      : estadia.fecha_entrada;
    const fechaSalidaFinal = dto.fecha_salida
      ? new Date(dto.fecha_salida)
      : estadia.fecha_salida;

    this.calcularNoches(fechaEntradaFinal, fechaSalidaFinal);

    if (
      await this.existeSolapamiento(
        habitacionFinal.id,
        fechaEntradaFinal,
        fechaSalidaFinal,
        id,
      )
    ) {
      throw new ConflictException(
        `La habitación ${habitacionFinal.numero} ya tiene una estadía registrada durante las fechas seleccionadas.`,
      );
    }

    estadia.huesped = huespedFinal;
    estadia.habitacion = habitacionFinal;
    estadia.fecha_entrada = fechaEntradaFinal;
    estadia.fecha_salida = fechaSalidaFinal;
    estadia.precio_noche_aplicado = precioNocheAplicado;

    await this.repositorioEstadia.save(estadia);
    return this.mapearConCalculos(await this.obtenerEntidadPorId(id));
  }

  async cancelar(id: number): Promise<EstadiaConCalculos> {
    const estadia = await this.obtenerEntidadPorId(id);

    if (estadia.estado === EstadoEstadia.CANCELADA) {
      return this.mapearConCalculos(estadia);
    }

    estadia.estado = EstadoEstadia.CANCELADA;
    await this.repositorioEstadia.save(estadia);

    return this.mapearConCalculos(await this.obtenerEntidadPorId(id));
  }

  async obtenerTodos(): Promise<EstadiaConCalculos[]> {
    const estadias = await this.repositorioEstadia.find({
      relations: {
        huesped: true,
        habitacion: { tipo_habitacion: true },
      },
      order: { id: 'ASC' },
    });

    return estadias.map((estadia) => this.mapearConCalculos(estadia));
  }

  async obtenerPorId(id: number): Promise<EstadiaConCalculos> {
    return this.mapearConCalculos(await this.obtenerEntidadPorId(id));
  }

  private async obtenerHuesped(id: number): Promise<Huesped> {
    const huesped = await this.repositorioHuesped.findOne({ where: { id } });
    if (!huesped) {
      throw new NotFoundException(`No existe el huésped con ID ${id}`);
    }
    return huesped;
  }

  private async obtenerHabitacion(id: number): Promise<Habitacion> {
    const habitacion = await this.repositorioHabitacion.findOne({
      where: { id },
      relations: { tipo_habitacion: true },
    });
    if (!habitacion) {
      throw new NotFoundException(`No existe la habitación con ID ${id}`);
    }
    return habitacion;
  }

  private async obtenerEntidadPorId(id: number): Promise<Estadia> {
    const estadia = await this.repositorioEstadia.findOne({
      where: { id },
      relations: {
        huesped: true,
        habitacion: { tipo_habitacion: true },
        consumos: true,
      },
    });

    if (!estadia) {
      throw new NotFoundException(`No existe la estadía con ID ${id}`);
    }
    return estadia;
  }
}

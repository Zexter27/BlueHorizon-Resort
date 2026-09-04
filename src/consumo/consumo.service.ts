import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumo } from './entities/consumo.entity';
import { Estadia } from '../estadia/entities/estadia.entity';
import { CreateConsumoDto } from './dto/create-consumo.dto';
import { UpdateConsumoDto } from './dto/update-consumo.dto';

export interface CuentaHuesped {
  estadia_id: number;
  huesped: {
    id: number;
    nombre: string;
    apellido: string;
    documento: string;
    telefono: string | null;
    correo: string | null;
  };

  habitacion_numero: string;
  tipo_habitacion: string;
  noches: number;
  precio_noche_aplicado: number;
  subtotal_estadia: number;

  consumos: {
    id: number;
    descripcion: string;
    precio: number;
    cantidad: number;
    fecha: Date;
    total: number;
  }[];

  total_consumos: number;
  total_acumulado: number;
}

@Injectable()
export class ConsumoService {
  constructor(
    @InjectRepository(Consumo)
    private readonly repositorioConsumo: Repository<Consumo>,

    @InjectRepository(Estadia)
    private readonly repositorioEstadia: Repository<Estadia>,
  ) {}

  private calcularNoches(fechaEntrada: Date, fechaSalida: Date): number {
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);

    const difMs = salida.getTime() - entrada.getTime();
    return Math.round(difMs / (1000 * 60 * 60 * 24));
  }

  private async obtenerEstadiaOFallar(estadiaId: number): Promise<Estadia> {
    const estadia = await this.repositorioEstadia.findOne({
      where: {
        id: estadiaId,
      },
      relations: {
        huesped: true,
        habitacion: {
          tipo_habitacion: true,
        },
        consumos: true,
      },
    });

    if (!estadia) {
      throw new NotFoundException(`No existe la estadía con ID ${estadiaId}`);
    }

    return estadia;
  }

  async crear(crearConsumoDto: CreateConsumoDto): Promise<Consumo> {
    const estadia = await this.obtenerEstadiaOFallar(
      crearConsumoDto.estadia_id,
    );

    const consumo = this.repositorioConsumo.create({
      estadia,
      descripcion: crearConsumoDto.descripcion,
      precio: crearConsumoDto.precio,
      cantidad: crearConsumoDto.cantidad ?? 1,
      fecha: crearConsumoDto.fecha ? new Date(crearConsumoDto.fecha) : new Date(),
    });

    return await this.repositorioConsumo.save(consumo);
  }

  async obtenerTodos(): Promise<Consumo[]> {
    return await this.repositorioConsumo.find({
      relations: {
        estadia: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async obtenerPorId(id: number): Promise<Consumo> {
    const consumo = await this.repositorioConsumo.findOne({
      where: {
        id,
      },
      relations: {
        estadia: true,
      },
    });

    if (!consumo) {
      throw new NotFoundException(`No existe el consumo con ID ${id}`);
    }

    return consumo;
  }

  async actualizar(
    id: number,
    actualizarConsumoDto: UpdateConsumoDto,
  ): Promise<Consumo> {
    const consumo = await this.obtenerPorId(id);

    if (actualizarConsumoDto.estadia_id !== undefined) {
      const estadia = await this.obtenerEstadiaOFallar(
        actualizarConsumoDto.estadia_id,
      );
      consumo.estadia = estadia;
    }

    if (actualizarConsumoDto.descripcion !== undefined) {
      consumo.descripcion = actualizarConsumoDto.descripcion;
    }

    if (actualizarConsumoDto.precio !== undefined) {
      consumo.precio = actualizarConsumoDto.precio;
    }

    if (actualizarConsumoDto.cantidad !== undefined) {
      consumo.cantidad = actualizarConsumoDto.cantidad;
    }

    if (actualizarConsumoDto.fecha !== undefined) {
      consumo.fecha = new Date(actualizarConsumoDto.fecha);
    }

    return await this.repositorioConsumo.save(consumo);
  }

  async eliminar(id: number): Promise<void> {
    const consumo = await this.obtenerPorId(id);
    await this.repositorioConsumo.remove(consumo);
  }

  async obtenerCuentaPorEstadia(estadiaId: number): Promise<CuentaHuesped> {
    const estadia = await this.obtenerEstadiaOFallar(estadiaId);

    const noches = this.calcularNoches(
      estadia.fecha_entrada,
      estadia.fecha_salida,
    );

    const precioNocheAplicado = Number(estadia.precio_noche_aplicado);
    const subtotalEstadia = precioNocheAplicado * noches;

    const consumosDetallados = estadia.consumos.map((consumo) => {
      const total = Number(consumo.precio) * consumo.cantidad;

      return {
        id: consumo.id,
        descripcion: consumo.descripcion,
        precio: Number(consumo.precio),
        cantidad: consumo.cantidad,
        fecha: consumo.fecha,
        total,
      };
    });

    const totalConsumos = consumosDetallados.reduce(
      (acumulado, consumo) => acumulado + consumo.total,
      0,
    );

    return {
      estadia_id: estadia.id,
    
      huesped: {
        id: estadia.huesped.id,
        nombre: estadia.huesped.nombre,
        apellido: estadia.huesped.apellido,
        documento: estadia.huesped.documento,
        telefono: estadia.huesped.telefono,
        correo: estadia.huesped.correo,
      },
    
      habitacion_numero: estadia.habitacion.numero,
      tipo_habitacion: estadia.habitacion.tipo_habitacion.nombre,
      noches,
      precio_noche_aplicado: precioNocheAplicado,
      subtotal_estadia: subtotalEstadia,
      consumos: consumosDetallados,
      total_consumos: totalConsumos,
      total_acumulado: subtotalEstadia + totalConsumos,
    };
  }
}
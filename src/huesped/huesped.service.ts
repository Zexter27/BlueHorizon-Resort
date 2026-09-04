import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Huesped } from './entities/huesped.entity';
import { CreateHuespedDto } from './dto/create-huesped.dto';
import { UpdateHuespedDto } from './dto/update-huesped.dto';
import { Estadia } from '../estadia/entities/estadia.entity';

@Injectable()
export class HuespedService {
  constructor(
    @InjectRepository(Huesped)
    private readonly repositorioHuesped: Repository<Huesped>,

    @InjectRepository(Estadia)
    private readonly repositorioEstadia: Repository<Estadia>,
  ) {}

  async crear(crearHuespedDto: CreateHuespedDto): Promise<Huesped> {
    const huespedExistente = await this.repositorioHuesped.findOne({
      where: {
        documento: crearHuespedDto.documento,
      },
    });

    if (huespedExistente) {
      throw new ConflictException(
        `Ya existe un huésped con el documento ${crearHuespedDto.documento}`,
      );
    }

    const huesped = this.repositorioHuesped.create({
      nombre: crearHuespedDto.nombre,
      apellido: crearHuespedDto.apellido,
      documento: crearHuespedDto.documento,
      telefono: crearHuespedDto.telefono ?? null,
      correo: crearHuespedDto.correo ?? null,
    });

    return await this.repositorioHuesped.save(huesped);
  }

  async obtenerTodos(): Promise<Huesped[]> {
    return await this.repositorioHuesped.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async obtenerPorId(id: number): Promise<Huesped> {
    const huesped = await this.repositorioHuesped.findOne({
      where: {
        id,
      },
    });

    if (!huesped) {
      throw new NotFoundException(`No existe el huésped con ID ${id}`);
    }
    return huesped;
  }

  async actualizar(
    id: number,
    actualizarHuespedDto: UpdateHuespedDto,
  ): Promise<Huesped> {
    const huesped = await this.obtenerPorId(id);

    if (actualizarHuespedDto.documento) {
      const huespedExistente = await this.repositorioHuesped.findOne({
        where: {
          documento: actualizarHuespedDto.documento,
        },
      });

      if (huespedExistente && huespedExistente.id !== id) {
        throw new ConflictException(
          `Ya existe otro huésped con el documento ${actualizarHuespedDto.documento}`,
        );
      }
    }

    Object.assign(huesped, actualizarHuespedDto);
    return await this.repositorioHuesped.save(huesped);
  }

  async eliminar(id: number): Promise<void> {
    const huesped = await this.obtenerPorId(id);
  
    const cantidadEstadias =
      await this.repositorioEstadia.count({
        where: {
          huesped: {
            id: huesped.id,
          },
        },
      });
    
    if (cantidadEstadias > 0) {
      throw new ConflictException(
        `No se puede eliminar el huésped ${huesped.nombre} ${huesped.apellido} porque tiene ${cantidadEstadias} estadía(s) asociada(s).`,
      );
    }
  
    await this.repositorioHuesped.remove(huesped);
  }
}

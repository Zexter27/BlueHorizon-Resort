import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { TipoHabitacionService } from './tipo-habitacion.service';

import { CreateTipoHabitacionDto } from './dto/create-tipo-habitacion.dto';
import { UpdateTipoHabitacionDto } from './dto/update-tipo-habitacion.dto';

@Controller('tipos-habitacion')
export class TipoHabitacionController {
  constructor(
    private readonly tipoHabitacionService: TipoHabitacionService,
  ) {}

  @Post()
  crear(@Body() crearTipoHabitacionDto: CreateTipoHabitacionDto,) {
    return this.tipoHabitacionService.crear(
      crearTipoHabitacionDto,
    );
  }

  @Get()
  obtenerTodos() {
    return this.tipoHabitacionService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tipoHabitacionService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    actualizarTipoHabitacionDto: UpdateTipoHabitacionDto,
  ) {
    return this.tipoHabitacionService.actualizar(
      id,
      actualizarTipoHabitacionDto,
    );
  }

  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tipoHabitacionService.eliminar(id);
  }
}
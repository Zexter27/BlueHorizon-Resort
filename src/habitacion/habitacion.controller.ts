import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,  Query,} from '@nestjs/common';
import { HabitacionService } from './habitacion.service';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { ConsultarDisponibilidadDto } from './dto/consultar-disponibilidad.dto';

@Controller('habitaciones')
export class HabitacionController {
  constructor(private readonly habitacionService: HabitacionService,) {}

  @Post()
  crear( @Body() crearHabitacionDto: CreateHabitacionDto,) {
    return this.habitacionService.crear(
      crearHabitacionDto,
    );
  }

  @Get()
  obtenerTodos() {
    return this.habitacionService.obtenerTodos();
  }

  @Get('disponibles')
  obtenerDisponibles(@Query() consultarDisponibilidadDto: ConsultarDisponibilidadDto,) {
    return this.habitacionService.obtenerDisponibles(
      consultarDisponibilidadDto,
    );
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number,) {
    return this.habitacionService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() actualizarHabitacionDto: UpdateHabitacionDto,) {
    return this.habitacionService.actualizar(
      id,
      actualizarHabitacionDto,
    );
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number,) {
    return this.habitacionService.eliminar(id);
  }
}
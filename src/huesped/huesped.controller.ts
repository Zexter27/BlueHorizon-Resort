import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { HuespedService } from './huesped.service';
import { CreateHuespedDto } from './dto/create-huesped.dto';
import { UpdateHuespedDto } from './dto/update-huesped.dto';

@Controller('huespedes')
export class HuespedController {
  constructor(private readonly huespedService: HuespedService) {}

  @Post()
  crear(@Body() crearHuespedDto: CreateHuespedDto) {
    return this.huespedService.crear(crearHuespedDto);
  }

  @Get()
  obtenerTodos() {
    return this.huespedService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.huespedService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarHuespedDto: UpdateHuespedDto,
  ) {
    return this.huespedService.actualizar(id, actualizarHuespedDto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.huespedService.eliminar(id);
  }
}

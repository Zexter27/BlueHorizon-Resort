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
import { ConsumoService } from './consumo.service';
import { CreateConsumoDto } from './dto/create-consumo.dto';
import { UpdateConsumoDto } from './dto/update-consumo.dto';

@Controller('consumos')
export class ConsumoController {
  constructor(private readonly consumoService: ConsumoService) {}

  @Post()
  crear(@Body() crearConsumoDto: CreateConsumoDto) {
    return this.consumoService.crear(crearConsumoDto);
  }

  @Get()
  obtenerTodos() {
    return this.consumoService.obtenerTodos();
  }

  @Get('cuenta/:estadiaId')
  obtenerCuenta(@Param('estadiaId', ParseIntPipe) estadiaId: number) {
    return this.consumoService.obtenerCuentaPorEstadia(estadiaId);
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.consumoService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarConsumoDto: UpdateConsumoDto,
  ) {
    return this.consumoService.actualizar(id, actualizarConsumoDto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.consumoService.eliminar(id);
  }
}
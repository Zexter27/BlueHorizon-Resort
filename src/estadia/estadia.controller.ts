import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post,} from '@nestjs/common';
import { EstadiaService } from './estadia.service';
import { CreateEstadiaDto } from './dto/create-estadia.dto';
import { UpdateEstadiaDto } from './dto/update-estadia.dto';

@Controller('estadias')
export class EstadiaController {
  constructor(private readonly estadiaService: EstadiaService) {}

  @Post()
  crear(@Body() crearEstadiaDto: CreateEstadiaDto) {
    return this.estadiaService.crear(crearEstadiaDto);
  }

  @Get()
  obtenerTodos() {
    return this.estadiaService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.estadiaService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarEstadiaDto: UpdateEstadiaDto,
  ) {
    return this.estadiaService.actualizar(id, actualizarEstadiaDto);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.estadiaService.cancelar(id);
  }
}

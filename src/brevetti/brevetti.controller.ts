import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Query, 
    UseGuards 
  } from '@nestjs/common';
  import { BrevettiService } from './brevetti.service';
  import { CreateBrevettoDto } from './dto/create-brevetto.dto';
  import { UpdateBrevettoDto, AddNotaBrevettoDto, AddTimelineItemBrevettoDto } from './dto/update-brevetto.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  
  @Controller('brevetti')
  @UseGuards(JwtAuthGuard)
  export class BrevettiController {
    constructor(private readonly brevettiService: BrevettiService) {}
  
    @Post()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async create(@Body() createBrevettoDto: CreateBrevettoDto) {
      return this.brevettiService.create(createBrevettoDto);
    }
  
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('sortBy') sortBy: string = 'dataDeposito',
      @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
      @Query('stato') stato?: string,
      @Query('titolare') titolare?: string,
      @Query('dataDepositoDa') dataDepositoDa?: Date,
      @Query('dataDepositoA') dataDepositoA?: Date,
      @Query('search') search?: string,
    ) {
      return this.brevettiService.findAll({
        page,
        limit,
        sortBy,
        sortOrder,
        filtri: {
          stato,
          titolare,
          dataDepositoDa,
          dataDepositoA,
          search
        }
      });
    }
  
    @Get('scadenze')
    async findScadenze(
      @Query('giorni') giorni: number = 30,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ) {
      return this.brevettiService.findScadenze(giorni, page, limit);
    }
  
    @Get('statistiche')
    async getStatistiche() {
      return this.brevettiService.getStatistiche();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.brevettiService.findOne(id);
    }
  
    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async update(
      @Param('id') id: string, 
      @Body() updateBrevettoDto: UpdateBrevettoDto
    ) {
      return this.brevettiService.update(id, updateBrevettoDto);
    }
  
    @Post(':id/note')
    async addNota(
      @Param('id') id: string,
      @Body() addNotaDto: AddNotaBrevettoDto
    ) {
      return this.brevettiService.addNota(id, addNotaDto.nota);
    }
  
    @Post(':id/timeline')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async addTimelineItem(
      @Param('id') id: string,
      @Body() addTimelineItemDto: AddTimelineItemBrevettoDto
    ) {
      return this.brevettiService.addTimelineItem(id, addTimelineItemDto.timelineItem);
    }
  
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async remove(@Param('id') id: string) {
      return this.brevettiService.remove(id);
    }
  }
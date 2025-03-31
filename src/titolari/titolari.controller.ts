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
  import { TitolariService } from './titolari.service';
  import { CreateTitolareDto } from './dto/create-titolare.dto';
  import { UpdateTitolareDto } from './dto/update-titolare.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  
  @Controller('titolari')
  @UseGuards(JwtAuthGuard)
  export class TitolariController {
    constructor(private readonly titolariService: TitolariService) {}
  
    @Post()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async create(@Body() createTitolareDto: CreateTitolareDto) {
      return this.titolariService.create(createTitolareDto);
    }
  
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('sortBy') sortBy: string = 'nome',
      @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
      @Query('tipologia') tipologia?: 'PERSONA_FISICA' | 'AZIENDA' | 'ENTE_PUBBLICO',
      @Query('search') search?: string,
      @Query('attivo') attivo?: boolean,
    ) {
      return this.titolariService.findAll({
        page,
        limit,
        sortBy,
        sortOrder,
        filtri: {
          tipologia,
          search,
          attivo
        }
      });
    }
  
    @Get('statistiche')
    async getStatistiche() {
      return this.titolariService.getStatistiche();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.titolariService.findOne(id);
    }
  
    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async update(
      @Param('id') id: string, 
      @Body() updateTitolareDto: UpdateTitolareDto
    ) {
      return this.titolariService.update(id, updateTitolareDto);
    }
  
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async remove(@Param('id') id: string) {
      return this.titolariService.remove(id);
    }
  
    @Get('search/:nome')
    async findByNome(@Param('nome') nome: string) {
      return this.titolariService.findByNome(nome);
    }
  }
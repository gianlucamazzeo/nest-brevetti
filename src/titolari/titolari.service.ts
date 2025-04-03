import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Titolare, TitolareDocument } from './schemas/titolare.schema';
import { CreateTitolareDto } from './dto/create-titolare.dto';
import { UpdateTitolareDto } from './dto/update-titolare.dto';

@Injectable()
export class TitolariService {
  private readonly logger = new Logger(TitolariService.name);

  constructor(
    @InjectModel(Titolare.name) private titolareModel: Model<TitolareDocument>,
  ) {}

  async create(createTitolareDto: CreateTitolareDto): Promise<Titolare> {
    this.logger.log(`Creazione nuovo titolare: ${createTitolareDto.nome}`);
    const createdTitolare = new this.titolareModel(createTitolareDto);
    return createdTitolare.save();
  }

  async findAll(options: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    filtri?: {
      tipologia?: 'PERSONA_FISICA' | 'AZIENDA' | 'ENTE_PUBBLICO';
      search?: string;
      attivo?: boolean;
    };
  }) {
    const { page, limit, sortBy, sortOrder, filtri } = options;
    const skip = (page - 1) * limit;

    // Costruisci il filtro di query
    const query: FilterQuery<TitolareDocument> = {};

    if (filtri) {
      if (filtri.tipologia) {
        query.tipologia = filtri.tipologia;
      }

      if (filtri.attivo !== undefined) {
        query.attivo = filtri.attivo;
      }

      if (filtri.search) {
        query.$or = [
          { nome: { $regex: filtri.search, $options: 'i' } },
          { codiceFiscale: { $regex: filtri.search, $options: 'i' } },
          { partitaIva: { $regex: filtri.search, $options: 'i' } },
          { email: { $regex: filtri.search, $options: 'i' } },
        ];
      }
    }

    // Costruisci l'ordinamento
    const sort: Record<string, 1 |-1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Esegui la query
    const titolari = await this.titolareModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    // Conta il totale di documenti per la paginazione
    const total = await this.titolareModel.countDocuments(query).exec();

    return {
      data: titolari,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Titolare> {
    const titolare = await this.titolareModel.findById(id).exec();

    if (!titolare) {
      throw new NotFoundException(`Titolare con ID ${id} non trovato`);
    }

    return titolare;
  }

  async update(
    id: string,
    updateTitolareDto: UpdateTitolareDto,
  ): Promise<Titolare> {
    this.logger.log(`Aggiornamento titolare con ID: ${id}`);
    const titolare = await this.titolareModel
      .findByIdAndUpdate(id, updateTitolareDto, { new: true })
      .exec();

    if (!titolare) {
      throw new NotFoundException(`Titolare con ID ${id} non trovato`);
    }

    return titolare;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    this.logger.log(`Eliminazione titolare con ID: ${id}`);
    const result = await this.titolareModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Titolare con ID ${id} non trovato`);
    }

    return { deleted: true };
  }

  async findByNome(nome: string): Promise<Titolare[]> {
    return this.titolareModel
      .find({ nome: { $regex: nome, $options: 'i' } })
      .exec();
  }

  async getStatistiche() {
    // Conteggio titolari per tipologia
    const perTipologia = await this.titolareModel
      .aggregate([
        { $group: { _id: '$tipologia', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .exec();

    // Conteggio titolari attivi vs inattivi
    const perStato = await this.titolareModel
      .aggregate([{ $group: { _id: '$attivo', count: { $sum: 1 } } }])
      .exec();

    // Conteggio totale
    const totalTitolari = await this.titolareModel.countDocuments().exec();

    return {
      totale: totalTitolari,
      perTipologia,
      perStato,
    };
  }
}

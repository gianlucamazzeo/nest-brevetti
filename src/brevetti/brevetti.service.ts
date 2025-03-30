import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Brevetto, BrevettoDocument } from './schemas/brevetto.schema';
import { CreateBrevettoDto } from './dto/create-brevetto.dto';
import { UpdateBrevettoDto } from './dto/update-brevetto.dto';
import { StatoBrevetto } from './enums/stato-brevetto.enum';

@Injectable()
export class BrevettiService {
  constructor(
    @InjectModel(Brevetto.name) private brevettoModel: Model<BrevettoDocument>
  ) {}

  async create(createBrevettoDto: CreateBrevettoDto): Promise<Brevetto> {
    const createdBrevetto = new this.brevettoModel(createBrevettoDto);
    return createdBrevetto.save();
  }

  async findAll(options: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    filtri?: {
      stato?: string;
      titolare?: string;
      dataDepositoDa?: Date;
      dataDepositoA?: Date;
      search?: string;
    };
  }) {
    const { page, limit, sortBy, sortOrder, filtri } = options;
    const skip = (page - 1) * limit;
    
    // Costruisci il filtro di query
    const query: FilterQuery<BrevettoDocument> = {};
    
    if (filtri) {
      if (filtri.stato) {
        query.stato = filtri.stato;
      }
      
      if (filtri.titolare) {
        query.titolari = filtri.titolare;
      }
      
      if (filtri.dataDepositoDa || filtri.dataDepositoA) {
        query.dataDeposito = {};
        
        if (filtri.dataDepositoDa) {
          query.dataDeposito.$gte = new Date(filtri.dataDepositoDa);
        }
        
        if (filtri.dataDepositoA) {
          query.dataDeposito.$lte = new Date(filtri.dataDepositoA);
        }
      }
      
      if (filtri.search) {
        query.$or = [
          { titolo: { $regex: filtri.search, $options: 'i' } },
          { numero: { $regex: filtri.search, $options: 'i' } },
          { descrizione: { $regex: filtri.search, $options: 'i' } }
        ];
      }
    }
    
    // Costruisci l'ordinamento
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Esegui la query
    const brevetti = await this.brevettoModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('titolari', 'nome tipologia')
      .exec();
    
    // Conta il totale di documenti per la paginazione
    const total = await this.brevettoModel.countDocuments(query).exec();
    
    return {
      data: brevetti,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string): Promise<Brevetto> {
    const brevetto = await this.brevettoModel
      .findById(id)
      .populate('titolari', 'nome tipologia')
      .exec();
      
    if (!brevetto) {
      throw new NotFoundException(`Brevetto con ID ${id} non trovato`);
    }
    
    return brevetto;
  }

  async update(id: string, updateBrevettoDto: UpdateBrevettoDto): Promise<Brevetto> {
    const brevetto = await this.brevettoModel
      .findByIdAndUpdate(id, updateBrevettoDto, { new: true })
      .exec();
      
    if (!brevetto) {
      throw new NotFoundException(`Brevetto con ID ${id} non trovato`);
    }
    
    return brevetto;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.brevettoModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Brevetto con ID ${id} non trovato`);
    }
    
    return { deleted: true };
  }

  async findScadenze(giorni: number = 30, page: number = 1, limit: number = 10) {
    const oggi = new Date();
    const limitDate = new Date();
    limitDate.setDate(oggi.getDate() + giorni);
    
    const query = {
      dataScadenza: {
        $gte: oggi,
        $lte: limitDate
      },
      stato: { $nin: [StatoBrevetto.SCADUTO, StatoBrevetto.DECADUTO, StatoBrevetto.RINUNCIATO, StatoBrevetto.ANNULLATO] }
    };
    
    const skip = (page - 1) * limit;
    
    const brevetti = await this.brevettoModel
      .find(query)
      .sort({ dataScadenza: 1 })
      .skip(skip)
      .limit(limit)
      .populate('titolari', 'nome tipologia')
      .exec();
    
    const total = await this.brevettoModel.countDocuments(query).exec();
    
    return {
      data: brevetti,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async addNota(id: string, nota: { testo: string; autore: string }) {
    const notaConData = {
      ...nota,
      data: new Date()
    };
    
    const brevetto = await this.brevettoModel
      .findByIdAndUpdate(
        id,
        { $push: { note: notaConData } },
        { new: true }
      )
      .exec();
    
    if (!brevetto) {
      throw new NotFoundException(`Brevetto con ID ${id} non trovato`);
    }
    
    return brevetto;
  }

  async addTimelineItem(id: string, timelineItem: { descrizione: string }) {
    const timelineItemConData = {
      ...timelineItem,
      data: new Date()
    };
    
    const brevetto = await this.brevettoModel
      .findByIdAndUpdate(
        id,
        { $push: { timeline: timelineItemConData } },
        { new: true }
      )
      .exec();
    
    if (!brevetto) {
      throw new NotFoundException(`Brevetto con ID ${id} non trovato`);
    }
    
    return brevetto;
  }

  async getStatistiche() {
    // Conteggio brevetti per stato
    const perStato = await this.brevettoModel.aggregate([
      { $group: { _id: '$stato', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).exec();
    
    // Conteggio brevetti per anno di deposito
    const perAnno = await this.brevettoModel.aggregate([
      { 
        $group: { 
          _id: { $year: '$dataDeposito' }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: -1 } }
    ]).exec();
    
    // Conteggio brevetti per titolare (top 5)
    const perTitolare = await this.brevettoModel.aggregate([
      { $unwind: '$titolari' },
      { $group: { _id: '$titolari', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { 
        $lookup: {
          from: 'titolares',
          localField: '_id',
          foreignField: '_id',
          as: 'titolareInfo'
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          titolareNome: { $arrayElemAt: ['$titolareInfo.nome', 0] }
        }
      }
    ]).exec();
    
    // Conteggio totale
    const totalBrevetti = await this.brevettoModel.countDocuments().exec();
    
    // Conteggio brevetti in scadenza nei prossimi 90 giorni
    const oggi = new Date();
    const limitDate = new Date();
    limitDate.setDate(oggi.getDate() + 90);
    
    const inScadenza = await this.brevettoModel.countDocuments({
      dataScadenza: {
        $gte: oggi,
        $lte: limitDate
      },
      stato: { $nin: [StatoBrevetto.SCADUTO, StatoBrevetto.DECADUTO, StatoBrevetto.RINUNCIATO, StatoBrevetto.ANNULLATO] }
    }).exec();
    
    return {
      totale: totalBrevetti,
      perStato,
      perAnno,
      perTitolare,
      inScadenza
    };
  }
}
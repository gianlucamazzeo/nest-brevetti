import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TitolariController } from './titolari.controller';
import { TitolariService } from './titolari.service';
import { Titolare, TitolareSchema } from './schemas/titolare.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Titolare.name, schema: TitolareSchema }
    ])
  ],
  controllers: [TitolariController],
  providers: [TitolariService],
  exports: [TitolariService]
})
export class TitolariModule {}
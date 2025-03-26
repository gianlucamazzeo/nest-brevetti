import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrevettiController } from './brevetti.controller';
import { BrevettiService } from './brevetti.service';
import { Brevetto, BrevettoSchema } from './schemas/brevetto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brevetto.name, schema: BrevettoSchema }
    ])
  ],
  controllers: [BrevettiController],
  providers: [BrevettiService],
  exports: [BrevettiService]
})
export class BrevettiModule {}
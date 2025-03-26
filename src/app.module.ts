import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Configurazione variabili d'ambiente
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.development`,
    }),

    // Configurazione MongoDB con Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          console.error('MONGODB_URI non è definito nelle variabili d\'ambiente');
        }
        return {
          uri
        }
      }
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

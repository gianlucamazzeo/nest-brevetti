import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UtentiModule } from './utenti/utenti.module';
import { TitolariModule } from './titolari/titolari.module';
import { BrevettiModule } from './brevetti/brevetti.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

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
          console.error(
            "MONGODB_URI non è definito nelle variabili d'ambiente",
          );
        }
        return {
          uri,
        };
      },
    }),
    UtentiModule,
    AuthModule,
    TitolariModule,
    BrevettiModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResponseInterceptor,
    },
  ],
})
export class AppModule {}

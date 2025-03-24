import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Utente, UtenteSchema } from '../utenti/schemas/utente.schema';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
//import { UtentiModule } from '../utenti/utenti.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1d'),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: Utente.name, schema: UtenteSchema }
    ]),
   // UtentiModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,],
  exports: [JwtModule, AuthService],
})


export class AuthModule {}
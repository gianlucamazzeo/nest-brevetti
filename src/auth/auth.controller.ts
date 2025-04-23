// src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      console.log('Login successful for:', loginDto.email);
      return result;
    } catch (error) {
      console.error('Login failed with error:', error);
      throw error;
    }
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Req() req: Request) {
    // Il JwtAuthGuard verifica automaticamente il token
    // e se valido, popola req.user con i dati dell'utente
    return {
      success: true,
      data: req.user,
      message: 'Token valido',
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.OK
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout() {
    // In un'implementazione semplice, il logout avviene principalmente sul client
    // Ma puoi anche implementare la logica di invalidazione del token qui
    return {
      success: true,
      data: null,
      message: 'Logout effettuato con successo',
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.OK
    };
  }
}
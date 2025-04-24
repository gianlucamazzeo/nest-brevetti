// src/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Utente } from '../utenti/schemas/utente.schema';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
// Modello Mongoose per Utente

  
  // Funzioni di mock per utenteModel
  let findOneMock: jest.Mock;
  let findByIdMock: jest.Mock;
  let signMock: jest.Mock;

  const mockUser = {
    _id: 'user-id-1',
    email: 'test@example.com',
    nome: 'Test',
    cognome: 'User',
    ruolo: 'UTENTE_STANDARD',
    attivo: true,
    ultimoAccesso: new Date(),
    comparePassword: jest.fn().mockImplementation(async () => true),
    toObject: jest.fn().mockImplementation(() => ({
      _id: 'user-id-1',
      email: 'test@example.com',
      nome: 'Test',
      cognome: 'User',
      ruolo: 'UTENTE_STANDARD',
      attivo: true,
      ultimoAccesso: new Date(),
    })),
    save: jest.fn().mockImplementation(async () => Promise.resolve()),
  };

  beforeEach(async () => {
    // Crea mock indipendenti per ogni funzione
    findOneMock = jest.fn();
    findByIdMock = jest.fn();
    
    signMock = jest.fn(() => 'test-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Utente.name),
          useValue: {
            findOne: findOneMock,
            findById: findByIdMock,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: signMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
})

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return user and token when credentials are valid', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'password123' };
      
      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(findOneMock).toHaveBeenCalledWith({ email: loginDto.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginDto.password);
      expect(mockUser.save).toHaveBeenCalled();
      expect(signMock).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        ruolo: mockUser.ruolo,
      });
      
      expect(result).toEqual({
        success: true,
        data: {
          user: expect.any(Object),
          token: 'test-token',
        },
        message: 'Login effettuato con successo',
        timestamp: expect.any(String),
        statusCode: 200,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const loginDto = { email: 'nonexistent@example.com', password: 'password123' };
      
      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(findOneMock).toHaveBeenCalledWith({ email: loginDto.email });
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      
      const userWithInvalidPassword = {
        ...mockUser,
        comparePassword: jest.fn().mockImplementation(async () => false),
      };
      
      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithInvalidPassword),
      });

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(findOneMock).toHaveBeenCalledWith({ email: loginDto.email });
      expect(userWithInvalidPassword.comparePassword).toHaveBeenCalledWith(loginDto.password);
    });

    it('should throw UnauthorizedException when user is not active', async () => {
      // Arrange
      const loginDto = { email: 'inactive@example.com', password: 'password123' };
      
      const inactiveUser = {
        ...mockUser,
        attivo: false,
        comparePassword: jest.fn().mockImplementation(async () => true),
      };
      
      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(inactiveUser),
      });

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(findOneMock).toHaveBeenCalledWith({ email: loginDto.email });
      expect(inactiveUser.comparePassword).toHaveBeenCalledWith(loginDto.password);
    });
  });

  describe('verifyToken', () => {
    it('should return user data when token is valid', async () => {
      // Arrange
      const userId = 'user-id-1';
      
      findByIdMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      // Act
      const result = await service.verifyToken(userId);

      // Assert
      expect(findByIdMock).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expect.objectContaining({
        _id: mockUser._id,
        email: mockUser.email,
      }));
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const userId = 'nonexistent-id';
      
      findByIdMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert
      await expect(service.verifyToken(userId)).rejects.toThrow(UnauthorizedException);
      expect(findByIdMock).toHaveBeenCalledWith(userId);
    });

    it('should throw UnauthorizedException when user is not active', async () => {
      // Arrange
      const userId = 'inactive-user-id';
      
      const inactiveUser = {
        ...mockUser,
        attivo: false,
        toObject: jest.fn().mockImplementation(() => ({
          _id: 'inactive-user-id',
          email: 'inactive@example.com',
          nome: 'Inactive',
          cognome: 'User',
          ruolo: 'UTENTE_STANDARD',
          attivo: false,
        })),
      };
      
      findByIdMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(inactiveUser),
      });

      // Act & Assert
      await expect(service.verifyToken(userId)).rejects.toThrow(UnauthorizedException);
      expect(findByIdMock).toHaveBeenCalledWith(userId);
    });
  });

  describe('logout', () => {
    it('should return true when logout is successful', async () => {
      // Arrange
      const userId = 'user-id-1';

      // Act
      const result = await service.logout(userId);

      // Assert
      expect(result).toBe(true);
    });
  });
});
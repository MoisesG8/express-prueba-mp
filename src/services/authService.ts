import jwt from 'jsonwebtoken';
import authRepository from '../repositories/authRepository';
import {
    LoginResponse,
    JWTPayload,
    RegistrarRequest,
    ApiResponse
} from '../types/auth.types';

class AuthService {
    private jwtSecret: string;
    private jwtExpiresIn: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default_secret_change_in_production';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    generateToken(payload: JWTPayload): string {
        return jwt.sign(
            payload,
            this.jwtSecret,
            { expiresIn: this.jwtExpiresIn } as jwt.SignOptions
        );
    }


    verifyToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as JWTPayload;
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }

    async login(username: string, password: string): Promise<LoginResponse> {

        if (!username || !password) {
            throw new Error('Usuario y contraseña son requeridos');
        }

        const resultado = await authRepository.validarUsuario(username, password);
        if (!resultado || resultado.autenticado !== 1) {
            throw new Error('Credenciales inválidas');
        }

        if (!resultado.usuario_id || !resultado.rol_id) {
            throw new Error('Error en la respuesta del servidor');
        }

        const token = this.generateToken({
            usuario_id: resultado.usuario_id,
            username: username,
            rol_id: resultado.rol_id
        });

        return {
            success: true,
            token: token,
            user: {
                usuario_id: resultado.usuario_id,
                username: username,
                rol_id: resultado.rol_id
            }
        };
    }

    async registrar(userData: RegistrarRequest): Promise<ApiResponse<{ usuario_id: number }>> {

        if (!userData.username || !userData.password) {
            throw new Error('Usuario y contraseña son requeridos');
        }

        if (!userData.first_name || !userData.last_name) {
            throw new Error('Nombre y apellido son requeridos');
        }

        if (!userData.rol_id) {
            throw new Error('El rol es requerido');
        }

        if (userData.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        if (userData.email && !this.isValidEmail(userData.email)) {
            throw new Error('El email no es válido');
        }

        const resultado = await authRepository.crearUsuario(userData);

        return {
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                usuario_id: resultado.usuario_id
            }
        };
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

}

export default new AuthService();
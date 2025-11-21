import { Request, Response } from 'express';
import authService from '../services/authService';
import { LoginRequest, RegistrarRequest } from '../types/auth.types';

class AuthController {
    async login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            // Validación de campos requeridos
            if (!username || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Usuario y contraseña son requeridos'
                });
                return;
            }

            const resultado = await authService.login(username, password);

            res.status(200).json(resultado);

        } catch (error) {
            console.error('Error en login:', error);

            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
    }

    async registrar(req: Request<{}, {}, RegistrarRequest>, res: Response): Promise<void> {
        try {
            const { first_name, last_name, username, password, email, rol_id } = req.body;

            if (!first_name || !last_name || !username || !password || !rol_id) {
                res.status(400).json({
                    success: false,
                    message: 'Todos los campos obligatorios deben ser proporcionados'
                });
                return;
            }

            const resultado = await authService.registrar({
                first_name,
                last_name,
                username,
                password,
                email,
                rol_id
            });

            res.status(201).json(resultado);

        } catch (error) {
            console.error('Error en registro:', error);

            const errorMessage = (error as Error).message || 'Error al crear usuario';

            res.status(400).json({
                success: false,
                message: errorMessage
            });
        }
    }

}

export default new AuthController();

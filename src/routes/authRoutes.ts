import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================
router.post('/login', authController.login.bind(authController));
router.post('/registrar', authController.registrar.bind(authController));

export default router; 
import sql from 'mssql';
import { sqlConfig } from '../config/db';
import { ValidarUsuarioResult, CrearUsuarioResult, RegistrarRequest } from '../types/auth.types';

class AuthRepository {
    async validarUsuario(username: string, password: string): Promise<ValidarUsuarioResult> {
        let pool: sql.ConnectionPool | null = null;

        try {
            pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                .input('username', sql.VarChar(100), username)
                .input('password', sql.VarChar(200), password)
                .execute('sp_Usuario_Validar');

            return result.recordset[0] as ValidarUsuarioResult;
        } catch (error) {
            throw new Error(`Error en AuthRepository.validarUsuario: ${(error as Error).message}`);
        } finally {
            if (pool) {
                await pool.close();
            }
        }
    }

    async crearUsuario(userData: RegistrarRequest): Promise<CrearUsuarioResult> {
        let pool: sql.ConnectionPool | null = null;

        try {
            pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                .input('first_name', sql.VarChar(150), userData.first_name)
                .input('last_name', sql.VarChar(150), userData.last_name)
                .input('username', sql.VarChar(100), userData.username)
                .input('password', sql.VarChar(200), userData.password)
                .input('email', sql.VarChar(200), userData.email || null)
                .input('rol_id', sql.Int, userData.rol_id)
                .execute('sp_Usuario_Crear');

            return result.recordset[0] as CrearUsuarioResult;
        } catch (error) {
            throw new Error(`Error en AuthRepository.crearUsuario: ${(error as Error).message}`);
        } finally {
            if (pool) {
                await pool.close();
            }
        }
    }

    async crearExpediente(descripcion: string, tecnico_id: number) {
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request()
            .input("descripcion", descripcion)
            .input("tecnico_id", tecnico_id)
            .execute("sp_Expediente_Crear");

        return result.recordset[0];
    }
}

export default new AuthRepository();
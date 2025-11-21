import { sqlConfig } from '../config/db';
import sql from 'mssql';

class UsuariosRepository {

    async listarUsuarios(rol_id?: number) {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        if (rol_id) {
            request.input("rol_id", rol_id);
        }

        const result = await request.execute("sp_Usuarios_Listar");
        return result.recordset;
    }

}

export default new UsuariosRepository();

import { sqlConfig } from '../config/db';
import sql from 'mssql';

class ExpedientesRepository {

    async crearExpediente(descripcion: string, tecnico_id: number) {
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request()
            .input("descripcion", descripcion)
            .input("tecnico_id", tecnico_id)
            .execute("sp_Expediente_Crear");

        return result.recordset[0];
    }

    async listarExpedientes(filtros: {
        expediente_id?: number;
        tecnico_id?: number;
        coordinador_id?: number;
        estado_id?: number;
        fecha_inicio?: string;
        fecha_fin?: string;
    }) {
        const pool = await sql.connect(sqlConfig);

        const request = pool.request();

        if (filtros.expediente_id) request.input("expediente_id", filtros.expediente_id);
        if (filtros.tecnico_id) request.input("tecnico_id", filtros.tecnico_id);
        if (filtros.coordinador_id) request.input("coordinador_id", filtros.coordinador_id);
        if (filtros.estado_id) request.input("estado_id", filtros.estado_id);
        if (filtros.fecha_inicio) request.input("fecha_inicio", filtros.fecha_inicio);
        if (filtros.fecha_fin) request.input("fecha_fin", filtros.fecha_fin);

        const result = await request.execute("sp_Expedientes_Listar");

        return result.recordset;
    }

    async cambiarEstado(expediente_id: number, nuevo_estado_id: number, usuario_id: number, comentario?: string) {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input("expediente_id", expediente_id)
            .input("nuevo_estado_id", nuevo_estado_id)
            .input("usuario_id", usuario_id)
            .input("comentario", comentario || null)
            .execute("sp_Expediente_CambiarEstado");

        return result.recordset[0];
    }

}

export default new ExpedientesRepository();

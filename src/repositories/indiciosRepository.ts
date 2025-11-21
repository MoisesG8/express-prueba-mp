import { sqlConfig } from '../config/db';
import sql from 'mssql';

class IndiciosRepository {

    async crearIndicio(data: {
        expediente_id: number;
        descripcion: string;
        color?: string;
        tamano?: string;
        peso?: string;
        ubicacion?: string;
        tipo?: string;
        tecnico_id: number;
    }) {
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request()
            .input("expediente_id", data.expediente_id)
            .input("descripcion", data.descripcion)
            .input("color", data.color || null)
            .input("tamano", data.tamano || null)
            .input("peso", data.peso || null)
            .input("ubicacion", data.ubicacion || null)
            .input("tipo", data.tipo || null)
            .input("tecnico_id", data.tecnico_id)
            .execute("sp_Indicio_Crear");

        return result.recordset[0];
    }

    async listarIndicios(filtros: {
        indicio_id?: number;
        expediente_id?: number;
        tecnico_id?: number;
        fecha_inicio?: string;
        fecha_fin?: string;
    }) {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        if (filtros.indicio_id) request.input("indicio_id", filtros.indicio_id);
        if (filtros.expediente_id) request.input("expediente_id", filtros.expediente_id);
        if (filtros.tecnico_id) request.input("tecnico_id", filtros.tecnico_id);
        if (filtros.fecha_inicio) request.input("fecha_inicio", filtros.fecha_inicio);
        if (filtros.fecha_fin) request.input("fecha_fin", filtros.fecha_fin);

        const result = await request.execute("sp_Indicios_Listar");

        return result.recordset;
    }

}

export default new IndiciosRepository();

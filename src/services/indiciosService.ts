import indiciosRepository from "../repositories/indiciosRepository";

class IndiciosService {

    async crearIndicio(data: any) {

        if (!data.expediente_id) {
            throw new Error("El expediente es requerido.");
        }

        if (!data.descripcion || data.descripcion.trim().length < 3) {
            throw new Error("La descripción es requerida y debe tener al menos 3 caracteres.");
        }

        if (!data.tecnico_id) {
            throw new Error("El técnico es requerido.");
        }

        const resultado = await indiciosRepository.crearIndicio({
            expediente_id: Number(data.expediente_id),
            descripcion: data.descripcion,
            color: data.color,
            tamano: data.tamano,
            peso: data.peso,
            ubicacion: data.ubicacion,
            tipo: data.tipo,
            tecnico_id: Number(data.tecnico_id)
        });

        return {
            success: true,
            message: "Indicio creado exitosamente",
            data: resultado
        };
    }

    async listarIndicios(query: any) {
        const filtros = {
            indicio_id: query.indicio_id ? Number(query.indicio_id) : undefined,
            expediente_id: query.expediente_id ? Number(query.expediente_id) : undefined,
            tecnico_id: query.tecnico_id ? Number(query.tecnico_id) : undefined,
            fecha_inicio: query.fecha_inicio || undefined,
            fecha_fin: query.fecha_fin || undefined
        };

        const indicios = await indiciosRepository.listarIndicios(filtros);

        return {
            success: true,
            data: indicios
        };
    }
}

export default new IndiciosService();

import ExpedientesRepository from "../repositories/expedienteRepository";

class ExpedientesService {

    async crearExpediente(descripcion: string, tecnico_id: number) {

        if (!descripcion || descripcion.trim().length < 5) {
            throw new Error("La descripción es requerida y debe tener al menos 5 caracteres.");
        }

        if (!tecnico_id) {
            throw new Error("El técnico es requerido.");
        }

        const resultado = await ExpedientesRepository.crearExpediente(descripcion, tecnico_id);

        return {
            success: true,
            message: "Expediente creado exitosamente",
            expediente: resultado
        };
    }

    async listarExpedientes(filtros: any) {
        const expedientes = await ExpedientesRepository.listarExpedientes({
            expediente_id: filtros.expediente_id ? Number(filtros.expediente_id) : undefined,
            tecnico_id: filtros.tecnico_id ? Number(filtros.tecnico_id) : undefined,
            coordinador_id: filtros.coordinador_id ? Number(filtros.coordinador_id) : undefined,
            estado_id: filtros.estado_id ? Number(filtros.estado_id) : undefined,
            fecha_inicio: filtros.fecha_inicio || undefined,
            fecha_fin: filtros.fecha_fin || undefined
        });

        return {
            success: true,
            data: expedientes
        };
    }

    async cambiarEstado(data: {
        expediente_id: number;
        nuevo_estado_id: number;
        usuario_id: number;
        comentario?: string;
    }) {

        if (!data.expediente_id) {
            throw new Error("El expediente es requerido.");
        }

        if (!data.nuevo_estado_id) {
            throw new Error("Debe indicar el nuevo estado.");
        }

        const resultado = await ExpedientesRepository.cambiarEstado(
            data.expediente_id,
            data.nuevo_estado_id,
            data.usuario_id,
            data.comentario
        );

        return {
            success: true,
            message: "Estado actualizado correctamente",
            data: resultado
        };
    }

}

export default new ExpedientesService();

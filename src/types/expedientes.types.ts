export interface ExpedienteData {
    expediente_id: number;
    codigo_expediente: string;
    descripcion: string;
    fecha_registro: Date;
    estado_id: number;
    estado_nombre: string;
    tecnico_registra_id: number;
    tecnico_nombre: string;
    coordinador_id: number | null;
    coordinador_nombre: string | null;
    total_indicios: number;
}

export interface FiltrosExpedientes {
    expediente_id?: string;
    tecnico_id?: string;
    coordinador_id?: string;
    estado_id?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}
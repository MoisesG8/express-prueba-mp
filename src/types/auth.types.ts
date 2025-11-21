export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegistrarRequest {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email?: string;
    rol_id: number;
}

export interface ValidarUsuarioResult {
    autenticado: number;
    usuario_id?: number;
    rol_id?: number;
    mensaje?: string;
}

export interface CrearUsuarioResult {
    usuario_id: number;
    mensaje: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        usuario_id: number;
        username: string;
        rol_id: number;
    };
}

export interface JWTPayload {
    usuario_id: number;
    username: string;
    rol_id: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}
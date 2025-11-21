import usuariosRepository from "../repositories/usuariosRepository";

class UsuariosService {

    async listarUsuarios(query: any) {
        const rol = query.rol ? Number(query.rol) : undefined;

        const usuarios = await usuariosRepository.listarUsuarios(rol);

        return {
            success: true,
            data: usuarios
        };
    }

}

export default new UsuariosService();

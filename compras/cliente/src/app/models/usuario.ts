export class Usuario {
    _id: string;
    rol: string;

    constructor(_id: string, rol: string) {
        this._id = _id;
        this.rol = rol;
    }
}
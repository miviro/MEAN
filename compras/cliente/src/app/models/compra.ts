export class Compra {
    _id?: string;
    idArticulo: string;
    idCliente: string;
    cantidad: number;
    nombreComprador: string;
    direccion: string;

    constructor(idArticulo: string, idCliente: string, cantidad: number, nombreComprador: string, direccion: string) {
        this.idArticulo = idArticulo;
        this.idCliente = idCliente;
        this.cantidad = cantidad;
        this.nombreComprador = nombreComprador;
        this.direccion = direccion;
    }
}
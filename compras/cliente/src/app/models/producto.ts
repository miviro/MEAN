export class Producto {
    _id?: string;
    color: string;
    hoja: string;
    tapa: string;
    precio: number;
    stock: number;


    constructor(color: string, hoja: string, tapa: string, precio: number, stock: number) {
        this.color = color;
        this.hoja = hoja;
        this.tapa = tapa;
        this.precio = precio;
        this.stock = stock;
    }

}
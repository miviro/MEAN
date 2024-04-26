import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { Compra } from '../models/compra';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    url = 'http://localhost:5001/api/compras/';

    constructor(private http: HttpClient) { }

    buscarProductos(producto: string, idOrigen: string): Observable<any> {
        if (producto === '') {
            return this.http.get(this.url + "productos/?idOrigen=" + idOrigen);
        }
        return this.http.get(this.url + "productos/?" + producto + "&idOrigen=" + idOrigen);
    }

    buscarCompras(compra: string, idOrigen: string): Observable<any> {
        if (compra === '') {
            return this.http.get(this.url + "?idOrigen=" + idOrigen);
        }
        return this.http.get(this.url + "&idOrigen=" + idOrigen);
    }

    eliminarCompra(id: string, idOrigen: string): Observable<any> {
        return this.http.delete(this.url + id + "?idOrigen=" + idOrigen);
    }

    guardarCompra(compra: Compra, idOrigen: string): Observable<any> {
        return this.http.post(this.url + "?idOrigen=" + idOrigen, compra);
    }

    obtenerProducto(id: string): Observable<any> {
        return this.http.get(this.url + id);
    }

    editarCompra(id: string, compra: Producto, idOrigen: string): Observable<any> {
        return this.http.put(this.url + id + "?idOrigen=" + idOrigen, compra);
    }
}

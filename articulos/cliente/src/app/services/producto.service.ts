import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    url = 'http://localhost:4000/api/productos/';

    constructor(private http: HttpClient) { }

    getProductos(idOrigen: string): Observable<any> {
        return this.http.get(this.url + "?idOrigen={" + idOrigen + "}");
    }

    obtenerRolDeUsuario(id: string): Observable<any> {
        if (id && id !== '') {
            return this.http.get('http://localhost:5000/api/usuarios/' + id);
        } else {
            throw new Error("ID de usuario no válido");
        }
    }

    buscarProductos(producto: string, idOrigen: string): Observable<any> {

        return this.http.get(this.url + "?idOrigen=" + idOrigen + "&" + producto);
    }

    eliminarProducto(id: string, idOrigen: string): Observable<any> {
        return this.http.delete(this.url + "?idOrigen=" + idOrigen + "&" + id);
    }

    guardarProducto(producto: Producto, idOrigen: string): Observable<any> {
        return this.http.post(this.url + "?idOrigen=" + idOrigen + "&", producto);
    }

    obtenerProducto(id: string, idOrigen: string): Observable<any> {
        return this.http.get(this.url + "?idOrigen=" + idOrigen + "&" + id);
    }

    editarProducto(id: string, producto: Producto, idOrigen: string): Observable<any> {
        return this.http.put(this.url + "?idOrigen=" + idOrigen + "&" + id, producto);
    }
}

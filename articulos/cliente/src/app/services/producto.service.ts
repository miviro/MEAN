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

    getProductos(): Observable<any> {
        return this.http.get(this.url);
    }

    obtenerRolDeUsuario(id: string): Observable<any> {
        if (id && id !== '') {
            return this.http.get('http://localhost:5000/api/usuarios/' + id);
        } else {
            throw new Error("ID de usuario no válido");
        }
    }

    buscarProductos(producto: string): Observable<any> {

        return this.http.get(this.url + "?" + producto);
    }

    eliminarProducto(id: string): Observable<any> {
        return this.http.delete(this.url + id);
    }

    guardarProducto(producto: Producto): Observable<any> {
        return this.http.post(this.url, producto);
    }

    obtenerProducto(id: string): Observable<any> {
        return this.http.get(this.url + id);
    }

    editarProducto(id: string, producto: Producto): Observable<any> {
        return this.http.put(this.url + id, producto);
    }
}

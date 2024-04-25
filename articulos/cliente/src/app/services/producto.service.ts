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
        return this.http.get(this.url + "?idOrigen=" + idOrigen);
    }

    obtenerRolDeUsuario(id: string, idOrigen: string): Observable<any> {
        if (id && id !== '') {
            return this.http.get('http://localhost:5000/api/usuarios/' + id + '?idOrigen=' + idOrigen);
        } else {
            throw new Error("ID de usuario no válido");
        }
    }

    buscarProductos(producto: string, idOrigen: string): Observable<any> {
        if (producto === '') {
            return this.http.get(this.url + "?idOrigen=" + idOrigen);
        }
        return this.http.get(this.url + producto + "&idOrigen=" + idOrigen);
    }

    eliminarProducto(id: string, idOrigen: string): Observable<any> {
        return this.http.delete(this.url + id + "?idOrigen=" + idOrigen);
    }

    guardarProducto(producto: Producto, idOrigen: string): Observable<any> {
        return this.http.post(this.url + "?idOrigen=" + idOrigen + "&", producto);
    }

    obtenerProducto(id: string, idOrigen: string): Observable<any> {
        if (id === '') {
            throw new Error("ID de producto no válido");
        }
        return this.http.get(this.url + id + "?idOrigen=" + idOrigen);
    }

    editarProducto(id: string, producto: Producto, idOrigen: string): Observable<any> {
        return this.http.put(this.url + id + "?idOrigen=" + idOrigen, producto);
    }
}

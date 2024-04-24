import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    url = 'http://localhost:5000/api/usuarios/';

    constructor(private http: HttpClient) { }

    eliminarUsuario(_id: string): Observable<any> {
        return this.http.delete(this.url + _id);
    }

    crearUsuario(usuario: Usuario): Observable<any> {
        return this.http.post(this.url, { rol: usuario.rol });
    }

    obtenerUsuario(_id: string, rol: string, idOrigen: string): Observable<any> {
        let query = '?idOrigen=' + idOrigen + '&';
        if (_id && rol && _id !== '' && rol !== '') {
            query += `_id=${_id}&rol=${rol}`;
        } else if (_id && _id !== '') {
            query += `_id=${_id}`;
        } else if (rol && rol !== '') {
            query += `rol=${rol}`;
        }

        return this.http.get(this.url + query);
    }
}

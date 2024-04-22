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

    eliminarUsuario(id: string): Observable<any> {
        return this.http.delete(this.url + id);
    }

    crearUsuario(usuario: Usuario): Observable<any> {
        return this.http.post(this.url, usuario);
    }

    obtenerUsuario(id: string, rol: string): Observable<any> {
        let query = '';
        if (id && rol && id !== '' && rol !== '') {
            query = `?id=${id}&rol=${rol}`;
        } else if (id && id !== '') {
            query = `?id=${id}`;
        } else if (rol && rol !== '') {
            query = `?rol=${rol}`;
        }

        return this.http.get(this.url + query);
    }
}

import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.css'
})
export class ListarUsuariosComponent implements OnInit {
    sesionForm: FormGroup;
    consultaForm: FormGroup;
    crearForm: FormGroup;
    titulo = 'Introduzca su ID';
    listUsuarios: Usuario[] = [];
    pidiendoID: boolean = false;

    constructor(
        private _usuarioService: UsuarioService,
        private toastr: ToastrService,
        private fb: FormBuilder,
    ) {
        this.sesionForm = this.fb.group({
            _id: ['', Validators.required],
        })
        this.consultaForm = this.fb.group({
            _id: ['', Validators.required],
            rol: ['', Validators.required],
        })
        this.crearForm = this.fb.group({
            _id: ['', Validators.required],
            rol: ['', Validators.required],
        })
    }

    ngOnInit(): void { }

    defaultClickHandler() { console.log("Nunca se debería llamar a este método"); }

    pedirID(accion: () => void) {
        this.pidiendoID = true;
        this.defaultClickHandler = accion;
    }

    crearUsuario() {
        const rol = this.crearForm.value.rol;
        if (!rol) {
            this.toastr.error('Debe seleccionar un rol', 'Error');
            this.reestablecerTodo();
            return;
        }
        try {
            this._usuarioService.crearUsuario(this.crearForm.value).subscribe(
                (data: any) => {
                    let aux = "ID: " + data._id + " Rol: " + data.rol;
                    this.toastr.success(aux, 'Usuario creado!');
                },
                (error: any) => {
                    this.toastr.error((error as any).statusText, 'Error');
                }
            );
        } catch (error) {
            this.toastr.error((error as any).statusText, 'Error');
        }
        this.reestablecerTodo();
    }

    borrarUsuario() {
        this.pedirID(() => {
            try {
                const _id = this.sesionForm.value._id;
                if (_id == "" || _id == null || _id == undefined || _id == " ") {
                    this.toastr.error('Debe introducir un ID', 'Error');
                    return;
                }
                this._usuarioService.eliminarUsuario(_id).subscribe(
                    (data: any) => {
                        this.toastr.error('Usuario eliminado con exito', 'Usuario eliminado!');
                    },
                    (error: any) => {
                        this.toastr.error((error as any).statusText, 'Error');
                    }
                );
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
            }
            this.reestablecerTodo();
        });
    }

    consultaUsuarios() {
        this.pedirID(() => {
            const _id = this.consultaForm.value._id;
            const rol = this.consultaForm.value.rol;
            const idOrigen = this.sesionForm.value._id;

            if (idOrigen == "" || idOrigen == null || idOrigen == undefined || idOrigen == " ") {
                this.toastr.error('Debe introducir un ID', 'Error');
                return;
            }
            try {
                this._usuarioService.obtenerUsuario(_id, rol, idOrigen).subscribe(
                    (data: any) => {
                        this.reestablecerTodo();
                        this.listUsuarios = data;
                        this.toastr.info('Consulta realizada con exito', 'Consulta realizada!');
                    },
                    (error: any) => {
                        this.toastr.error((error as any).statusText, 'Error');
                        this.reestablecerTodo();
                    }
                );
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.reestablecerTodo();
            }
        });
    }

    reestablecerTodo() {
        this.listUsuarios = [];
        this.sesionForm.get("_id")?.reset();
        this.consultaForm.get("_id")?.reset();
        this.consultaForm.get("rol")?.reset();
        this.crearForm.get("_id")?.reset();
        this.crearForm.get("rol")?.reset();
        this.pidiendoID = false;
    }
}

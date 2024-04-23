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
    query: string | null;
    loggedRole: string = "sinrol";
    pidiendoID: boolean = false;
    idUsuario: string = '';

    constructor(
        private _usuarioService: UsuarioService,
        private toastr: ToastrService,
        private route: ActivatedRoute, // Inject ActivatedRoute
        private fb: FormBuilder,
        private router: Router,
    ) {
        this.query = this.route.snapshot.paramMap.get('query');
        this.sesionForm = this.fb.group({
            id: ['', Validators.required],
        })
        this.consultaForm = this.fb.group({
            id: ['', Validators.required],
            rol: ['', Validators.required],
        })
        this.crearForm = this.fb.group({
            id: ['', Validators.required],
            rol: ['', Validators.required],
        })
    }

    ngOnInit(): void { }

    defaultClickHandler() { console.log("Nunca se debería llamar a este método"); }

    pedirID(accion: () => void) {
        this.pidiendoID = true;
        this.defaultClickHandler = accion;
    }

    conseguirRol(id: string): string {
        let rol = "sinrol";
        try {
            this._usuarioService.obtenerUsuario(id, "").subscribe(
                (data: any) => {
                    rol = data.rol;
                },
                (error: any) => {
                    this.toastr.error((error as any).statusText, 'Error');
                }
            );
        } catch (error) {
            this.toastr.error((error as any).statusText, 'Error');
        }
        return rol;
    }

    crearUsuario() {
        const rol = this.crearForm.value.rol;
        if (!rol) {
            this.toastr.error('Debe seleccionar un rol', 'Error');
            return;
        }
        try {
            this._usuarioService.crearUsuario(this.crearForm.value).subscribe(
                (data: any) => {
                    let aux = "ID: " + data.id + " Rol: " + data.rol;
                    this.toastr.success(aux, 'Usuario creado!');
                },
                (error: any) => {
                    this.toastr.error((error as any).statusText, 'Error');
                }
            );
        } catch (error) {
            this.toastr.error((error as any).statusText, 'Error');
            this.sesionForm.get("id")?.reset();
        }

    }

    borrarUsuario() {
        this.pedirID(() => {
            try {
                const id = this.sesionForm.value.id;
                this._usuarioService.eliminarUsuario(id).subscribe(
                    (data: any) => {
                        this.loggedRole = "sinrol";
                        this.idUsuario = '';
                        this.sesionForm.get("id")?.reset();

                        this.toastr.error('Usuario eliminado con exito', 'Usuario eliminado!');
                        this.sesionForm.get("id")?.reset();
                        this.pidiendoID = false;
                        this.listUsuarios = [];
                    },
                    (error: any) => {
                        this.toastr.error((error as any).statusText, 'Error');
                        this.sesionForm.get("id")?.reset();
                        this.pidiendoID = false;
                        this.listUsuarios = [];

                    }
                );
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.sesionForm.get("id")?.reset();
                this.pidiendoID = false;
                this.listUsuarios = [];
            }
        });
    }

    consultaUsuarios() {
        const id = this.consultaForm.value.id;
        const rol = this.consultaForm.value.rol;

        try {
            this._usuarioService.obtenerUsuario(id, rol).subscribe(
                (data: any) => {
                    this.listUsuarios = data;
                    this.toastr.info('Consulta realizada con exito', 'Consulta realizada!');
                },
                (error: any) => {
                    this.listUsuarios = [];
                    this.toastr.error((error as any).statusText, 'Error');
                }
            );
        } catch (error) {
            this.toastr.error((error as any).statusText, 'Error');
        }
        this.toastr.info('Consulta realizada con exito', 'Consulta realizada!');
    }
}

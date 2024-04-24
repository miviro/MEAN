import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchScan } from 'rxjs';

@Component({
    selector: 'app-listar-productos',
    templateUrl: './listar-productos.component.html',
    styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements OnInit {
    productoForm: FormGroup;
    mongoForm: FormGroup;
    sesionForm: FormGroup;
    titulo = 'Crear producto';
    id: string | null;
    busca: string | null;
    listProductos: Producto[] = [];
    query: string | null;
    pidiendoID: boolean = false;

    constructor(
        private _productoService: ProductoService,
        private toastr: ToastrService,
        private route: ActivatedRoute, // Inject ActivatedRoute
        private fb: FormBuilder,
        private router: Router,
    ) {
        this.query = this.route.snapshot.paramMap.get('query');
        this.busca = this.route.snapshot.paramMap.get('busca');
        this.sesionForm = this.fb.group({
            id: ['', Validators.required],
        })
        if (this.busca === '1') {
            this.productoForm = this.fb.group({
                color: [''],
                hoja: [''],
                tapa: [''],
                precio: [''],
                stock: [''],
            })
        } else {
            this.productoForm = this.fb.group({
                color: ['', Validators.required],
                hoja: ['', Validators.required],
                tapa: ['', Validators.required],
                precio: ['', Validators.required],
                stock: ['', Validators.required],
            })
        }
        this.mongoForm = this.fb.group({
            _id: ['', Validators.required],
        })
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.busca === '1') {
            this.titulo = 'Buscar productos';
        }
    }
    ngOnInit(): void {
        /*this.route.queryParams.subscribe(params => {
            if (Object.keys(params).length === 0 && params.constructor === Object) {
                console.log("1");
                this.obtenerProductos();
            } else {
                console.log("2");

                const paramsString = Object.keys(params)
                    .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '') // Filter out null, undefined, and empty values
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                    .join('&');
                console.log(paramsString); // Log query parameters
                this.obtenerProductos(paramsString);
            }
        });*/
    }

    defaultClickHandler() { console.log("Nunca se debería llamar a este método"); }

    pedirID(accion: () => void) {
        this.pidiendoID = true;
        this.defaultClickHandler = accion;
    }

    obtenerProductos(params: string = '') {
        if (params === '') {
            // If there are no params, execute getProductos
            this._productoService.getProductos().subscribe(data => {
                console.log(data);
                this.listProductos = data;
            }, error => {
                console.log(error);
            });

        } else {
            console.log("params no es null");
            this._productoService.buscarProductos(params).subscribe(data => {
                console.log(data);
                this.listProductos = data;
            }, error => {
                console.log(error);
            });
        }
    }
    eliminarProducto(id: any) {
        this.pedirID(() => {
            const idUsuario = this.sesionForm.value.id;
            this._productoService.obtenerRolDeUsuario(idUsuario).subscribe(
                (data: any) => {
                    if (data.rol !== "admin") {
                        console.log(data);
                        this.toastr.error('No tiene permisos para borrar productos', 'Error');
                        this.pidiendoID = false;
                        return;
                    } else {
                        this._productoService.eliminarProducto(id, idUsuario).subscribe(data => {
                            this.toastr.info('El producto fue eliminado con exito', 'PRODUCTO ELIMINADO!');
                            this.obtenerProductos();
                            this.pidiendoID = false;
                        });
                    }
                },
                (error: any) => {
                    this.toastr.error((error as any).statusText, 'Error');
                    this.pidiendoID = false;
                });
        });
    }
    agregarProducto() {
        this.pedirID(() => {
            const id = this.sesionForm.value.id;
            console.log(id);

            try {
                this._productoService.obtenerRolDeUsuario(id).subscribe(
                    (data: any) => {
                        if (data.rol !== "admin") {
                            console.log(data);
                            this.toastr.error('No tiene permisos para agregar productos', 'Error');
                            this.pidiendoID = false;
                            return;
                        } else {
                            console.log(data);
                            let PRODUCTO: Producto = {
                                color: this.productoForm.get('color')?.value,
                                hoja: this.productoForm.get('hoja')?.value,
                                tapa: this.productoForm.get('tapa')?.value,
                                precio: this.productoForm.get('precio')?.value,
                                stock: this.productoForm.get('stock')?.value,
                            }
                            switch (this.titulo) {
                                case 'Buscar productos':
                                    const queryParams: { [key: string]: string | number } = {
                                        color: PRODUCTO.color,
                                        hoja: PRODUCTO.hoja,
                                        tapa: PRODUCTO.tapa,
                                        precio: PRODUCTO.precio,
                                        stock: PRODUCTO.stock,
                                        productId: this.mongoForm.get('_id')?.value
                                    };

                                    // Filter out null or empty values from queryParams
                                    Object.keys(queryParams).forEach(key => (queryParams[key] == null || queryParams[key] === '') && delete queryParams[key]);
                                    this.obtenerProductos(Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&'));
                                    this.toastr.success('La búsqueda fue realizada con exito', 'BUSQUEDA REALIZADA!');
                                    this.router.navigate(['/admin'], { queryParams: queryParams as any });
                                    this.pidiendoID = false;

                                    break;
                                case 'Editar producto':
                                    //editamos producto
                                    if (Object.values(PRODUCTO).some(value => value === null || value === '')) {
                                        this.toastr.error('El producto NO fue editado con exito', 'ERROR!');
                                    } else {
                                        this._productoService.editarProducto(this.mongoForm.get("_id")?.value, PRODUCTO, id).subscribe(data => {
                                            this.toastr.success('El producto fue editado con exito', 'OK!');
                                            this.obtenerProductos();
                                            this.pidiendoID = false;
                                            this.cambiarACrear();
                                        }, error => {
                                            console.log(error);
                                            this.toastr.error('El producto NO fue editado con exito', 'ERROR!');
                                        });
                                    }
                                    break;
                                case 'Crear producto':
                                    this._productoService.guardarProducto(PRODUCTO, id).subscribe(data => {
                                        this.toastr.success('El producto fue registrado con exito', 'PRODUCTO REGISTRADO!');
                                        this.pidiendoID = false;
                                        this.cambiarACrear();
                                        this.obtenerProductos();
                                    }, error => {
                                        console.log(error);
                                        this.toastr.error('El producto NO fue registrado con exito', 'ERROR!');
                                        this.pidiendoID = false;

                                        this.productoForm.reset();
                                        this.mongoForm.reset();
                                    })
                                    break
                                default:
                                    this.toastr.error('Error cliente', 'ERROR!');
                                    break;
                            }
                        }
                    },
                    (error: any) => {
                        this.toastr.error((error as any).statusText, 'Error');
                        return;
                    }
                );
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
            }
        });
    }

    cambiarACrear() {
        this.titulo = 'Crear producto';
        this.busca = '0';
        this.productoForm.reset();
        this.mongoForm.reset();
        this.router.navigate(['/admin'], {});
    }

    cambiarABusqueda() {
        this.titulo = 'Buscar productos';
        this.busca = '1';
        this.productoForm.reset();
        this.mongoForm.reset();
    }
    cambiarAEditar(id: string) {
        console.log(id);
        this.titulo = 'Editar producto';
        this.busca = '0';
        this.productoForm.reset();
        this.mongoForm.reset();
        this.mongoForm.setValue({ _id: id });
        this._productoService.obtenerProducto(id).subscribe(data => {
            this.productoForm.setValue({
                color: data.color,
                hoja: data.hoja,
                tapa: data.tapa,
                precio: data.precio,
                stock: data.stock,
            })
        });
    };
}

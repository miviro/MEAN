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

    obtenerProductos(params: string = '', idOrigen: string) {
        this._productoService.buscarProductos(params, idOrigen).subscribe(data => {
            console.log(data);
            this.listProductos = data;
            this.toastr.success('La búsqueda fue realizada con exito', 'BUSQUEDA REALIZADA!');
        }, error => {
            console.log(error);
            this.toastr.error((error as any).statusText, 'Error');
            this.listProductos = [];
        });

    }

    eliminarProducto(id: any) {
        this.pedirID(() => {
            const idOrigen = this.sesionForm.value.id;
            try {
                this._productoService.eliminarProducto(id, idOrigen).subscribe(data => {
                    this.toastr.info('El producto fue eliminado con exito', 'PRODUCTO ELIMINADO!');
                    this.router.navigate(['/admin'], {});
                    this.listProductos = [];
                    this.pidiendoID = false;
                });
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.pidiendoID = false;
            }
        });
    };

    agregarProducto() {
        this.pedirID(() => {
            const id = this.sesionForm.value.id;
            try {
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
                        this.obtenerProductos(Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&'), id);
                        this.router.navigate(['/admin']);
                        this.pidiendoID = false;

                        break;
                    case 'Editar producto':
                        //editamos producto
                        if (Object.values(PRODUCTO).some(value => value === null || value === '')) {
                            this.toastr.error('El producto NO fue editado con exito', 'ERROR!');
                        } else {
                            this._productoService.editarProducto(this.mongoForm.get("_id")?.value, PRODUCTO, id).subscribe(data => {
                                this.toastr.success('El producto fue editado con exito', 'OK!');
                                this.pidiendoID = false;
                                this.cambiarACrear();
                                this.listProductos = [];
                                this.router.navigate(['/admin'], {});
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
                            this.listProductos = [];
                            this.router.navigate(['/admin'], {});
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
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.pidiendoID = false;
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
        this.titulo = 'Editar producto';
        this.busca = '0';
        this.productoForm.reset();
        this.mongoForm.reset();
        this.mongoForm.setValue({ _id: id });
        let data = this.listProductos.find(producto => producto._id === id);

        this.productoForm.setValue({ // nunca deberian ser null
            color: data?.color ?? '',
            hoja: data?.hoja ?? '',
            tapa: data?.tapa ?? '',
            precio: data?.precio ?? '',
            stock: data?.stock ?? '',
        })
    };
}

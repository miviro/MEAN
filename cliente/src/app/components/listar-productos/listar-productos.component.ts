import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-listar-productos',
    templateUrl: './listar-productos.component.html',
    styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements OnInit {
    productoForm: FormGroup;
    mongoForm: FormGroup;
    titulo = 'Crear producto';
    id: string | null;
    busca: string | null;
    listProductos: Producto[] = [];
    query: string | null;

    constructor(
        private _productoService: ProductoService,
        private toastr: ToastrService,
        private route: ActivatedRoute, // Inject ActivatedRoute
        private fb: FormBuilder,
        private router: Router,
    ) {
        this.query = this.route.snapshot.paramMap.get('query');
        this.busca = this.route.snapshot.paramMap.get('busca');
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
        this.route.queryParams.subscribe(params => {
            this.esEditar();

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
        });
    }

    obtenerProductos(params: string = '') {
        // Check if there are any params in the URL
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
        this._productoService.eliminarProducto(id).subscribe(data => {
            this.toastr.info('El producto fue eliminado con exito', 'PRODUCTO ELIMINADO!');
            this.obtenerProductos();

        }, error => {
            console.log(error);
        });
    }
    agregarProducto() {
        const PRODUCTO: Producto = {
            color: this.productoForm.get('color')?.value,
            hoja: this.productoForm.get('hoja')?.value,
            tapa: this.productoForm.get('tapa')?.value,
            precio: this.productoForm.get('precio')?.value,
            stock: this.productoForm.get('stock')?.value,
        }

        if (this.busca === '1') {
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
            this.toastr.success('La búsqueda fue realizada con exito', 'BUSQUEDA REALIZADA!');
            this.router.navigate(['/admin'], { queryParams: queryParams as any });

        } else {
            if (this.id !== null) {
                //editamos producto
                this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data => {
                    this.toastr.info('El producto fue actualizado con exito', 'PRODUCTO ACTUALIZADO!');
                    this.router.navigate(['/admin']);

                }, error => {
                    console.log(error);
                    this.toastr.error('El producto NO fue registrado con exito', 'ERROR!');

                    this.productoForm.reset();
                })
            } else {
                //agregamos producto
                this._productoService.guardarProducto(PRODUCTO).subscribe(data => {
                    this.toastr.success('El producto fue registrado con exito', 'PRODUCTO REGISTRADO!');
                    this.router.navigate(['/admin']);

                }, error => {
                    console.log(error);
                    this.toastr.error('El producto NO fue registrado con exito', 'ERROR!');

                    this.productoForm.reset();
                })
            }
        }
    }

    esEditar() {
        if (this.id !== null) {
            this.titulo = 'Editar producto';
            this._productoService.obtenerProducto(this.id).subscribe(data => {
                this.productoForm.setValue({
                    color: data.color,
                    hoja: data.hoja,
                    tapa: data.tapa,
                    precio: data.precio,
                    stock: data.stock,
                })
            })
        }
    }
}

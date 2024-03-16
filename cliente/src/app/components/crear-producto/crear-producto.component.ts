import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { ProductoDataService } from '../../services/listProductos.service'; // Import the service
@Component({
    selector: 'app-crear-producto',
    templateUrl: './crear-producto.component.html',
    styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent implements OnInit {
    productoForm: FormGroup;
    titulo = 'Crear producto';
    id: string | null;
    busca: string | null;


    constructor(private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private _productoService: ProductoService,
        private aRouter: ActivatedRoute,
        private productoDataService: ProductoDataService) {

        this.productoForm = this.fb.group({
            color: ['', Validators.required],
            hoja: ['', Validators.required],
            tapa: ['', Validators.required],
            precio: ['', Validators.required],
            stock: ['', Validators.required],
        })
        this.id = this.aRouter.snapshot.paramMap.get('id');
        this.busca = this.aRouter.snapshot.paramMap.get('busca');
        if (this.busca === '1') {
            this.titulo = 'Buscar productos';

        }
    }

    ngOnInit(): void {
        this.esEditar();
    }

    agregarProducto() {
        //console.log(this.productoForm);

        //console.log(this.productoForm.get('producto')?.value);

        const PRODUCTO: Producto = {
            color: this.productoForm.get('color')?.value,
            hoja: this.productoForm.get('hoja')?.value,
            tapa: this.productoForm.get('tapa')?.value,
            precio: this.productoForm.get('precio')?.value,
            stock: this.productoForm.get('stock')?.value,
        }

        if (this.busca === '1') {
            const queryString = Object.entries(PRODUCTO)
                .filter(([key, value]) => value !== undefined && value !== null) // Exclude undefined and null values
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            this._productoService.buscarProductos(queryString).subscribe(data => {
                this.productoDataService.setListProductos(data);
                this.router.navigate(['/admin']);
            }, error => {
                console.log(error);
                this.toastr.error('Error en la búsqueda.', 'ERROR!');
                this.router.navigate(['/admin']);
            });
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



import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-compras',
    templateUrl: './compras.component.html',
    styleUrl: './compras.component.css'
})

export class ComprasComponent implements OnInit {
    pidiendoID: boolean = false;
    sesionForm: FormGroup;
    productoForm: FormGroup;
    compraForm: FormGroup;
    listProductos: Producto[] = [];
    comprandoProducto: boolean = false;

    constructor(
        private _productoService: ProductoService,
        private toastr: ToastrService,
        private route: ActivatedRoute, // Inject ActivatedRoute
        private fb: FormBuilder,
        private router: Router,
    ) {
        this.sesionForm = this.fb.group({
            id: ['', Validators.required],
        });
        this.productoForm = this.fb.group({
            _id: ['', Validators.required],
            color: ['', Validators.required],
            hoja: ['', Validators.required],
            tapa: ['', Validators.required],
            precio: ['', Validators.required],
            stock: ['', Validators.required],
        });
        this.compraForm = this.fb.group({
            idArticulo: ['', Validators.required],
            cantidad: ['', Validators.required],
            nombreComprador: ['', Validators.required],
            direccion: ['', Validators.required],
        });
    }
    ngOnInit(): void {

    }
    defaultClickHandler() { console.log('esta función nunca debería ejecutarse'); }
    pedirID(accion: () => void) {
        this.pidiendoID = true;
        this.defaultClickHandler = accion;
    }

    buscarProducto() {
        this.pedirID(() => {
            const idOrigen = this.sesionForm.get('id')?.value;
            let PRODUCTO: Producto = {
                _id: this.productoForm.get('_id')?.value,
                color: this.productoForm.get('color')?.value,
                hoja: this.productoForm.get('hoja')?.value,
                tapa: this.productoForm.get('tapa')?.value,
                precio: this.productoForm.get('precio')?.value,
                stock: this.productoForm.get('stock')?.value,
            }
            const queryParams: { [key: string]: string | number } = {
                color: PRODUCTO.color,
                hoja: PRODUCTO.hoja,
                tapa: PRODUCTO.tapa,
                precio: PRODUCTO.precio,
                stock: PRODUCTO.stock,
                productId: PRODUCTO._id || '', // Assign an empty string as the default value if PRODUCTO._id is undefined
            };

            // Filter out null or empty values from queryParams
            Object.keys(queryParams).forEach(key => (queryParams[key] == null || queryParams[key] === '') && delete queryParams[key]);
            this._productoService.buscarProductos(Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&'), idOrigen).subscribe(data => {
                this.listProductos = data;
                this.toastr.success('Búsqueda realizada', 'Correcto');
            }, error => {
                console.log(JSON.stringify(error));
                this.toastr.error((error as any).statusText, 'Error');
                this.listProductos = [];
            });
            this.pidiendoID = false;
        });
    }

    hacerCompra(id: any) {
        this.comprandoProducto = true;

        let data = this.listProductos.find(producto => producto._id === id);
        this.compraForm.setValue({
            idArticulo: data?._id,
            cantidad: 0,
            nombreComprador: '',
            direccion: '',
        });
    }

    comprarProducto() {
        this.pedirID(() => {
            const idOrigen = this.sesionForm.get('id')?.value;
            let COMPRA = this.compraForm.value;
            COMPRA.idCliente = idOrigen;
            try {
                this._productoService.guardarCompra(COMPRA, idOrigen).subscribe(data => {
                    this.toastr.success('Compra realizada', 'Correcto');
                    this.listProductos = [];
                    this.comprandoProducto = false;
                    this.pidiendoID = false;
                }, error => {
                    console.log(JSON.stringify(error));
                    this.toastr.error((error as any).statusText, 'Error');
                    this.comprandoProducto = false;
                });
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.comprandoProducto = false;
            }
        });
    }
}

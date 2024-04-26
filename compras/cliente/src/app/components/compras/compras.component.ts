import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Compra } from '../../models/compra';
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
    editandoCompra: boolean = false;
    sesionForm: FormGroup;
    productoForm: FormGroup;
    compraForm: FormGroup;
    editarCompraForm: FormGroup;
    buscaCompraForm: FormGroup;
    listProductos: Producto[] = [];
    listCompras: Compra[] = [];
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
        this.buscaCompraForm = this.fb.group({
            _id: ['', Validators.required],
            idCliente: ['', Validators.required],
            idArticulo: ['', Validators.required],
            cantidad: ['', Validators.required],
            nombreComprador: ['', Validators.required],
            direccion: ['', Validators.required],
        });
        this.editarCompraForm = this.fb.group({
            _id: ['', Validators.required],
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
    actualizar() {
        this.listProductos = [];
        this.listCompras = [];
        this.comprandoProducto = false;
        this.pidiendoID = false;
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
                this.actualizar();
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
                    this.toastr.success("ID de la compra: " + data._id, 'Correcto');
                    this.actualizar();
                }, error => {
                    console.log(JSON.stringify(error));
                    this.toastr.error((error as any).statusText, 'Error');
                    this.actualizar();
                });
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.actualizar();
            }
        });
    }

    buscarCompras() {
        this.pedirID(() => {
            const idOrigen = this.sesionForm.get('id')?.value;
            let COMPRA: Compra = {
                _id: this.buscaCompraForm.get('_id')?.value,
                idCliente: this.buscaCompraForm.get('idCliente')?.value,
                idArticulo: this.buscaCompraForm.get('idArticulo')?.value,
                cantidad: this.buscaCompraForm.get('cantidad')?.value,
                nombreComprador: this.buscaCompraForm.get('nombreComprador')?.value,
                direccion: this.buscaCompraForm.get('direccion')?.value,
            }
            const queryParams: { [key: string]: string | number } = {
                _id: COMPRA._id || '',
                idCliente: COMPRA.idCliente,
                idArticulo: COMPRA.idArticulo,
                cantidad: COMPRA.cantidad,
                nombreComprador: COMPRA.nombreComprador,
                direccion: COMPRA.direccion,
            };

            // Filter out null or empty values from queryParams
            Object.keys(queryParams).forEach(key => (queryParams[key] == null || queryParams[key] === '') && delete queryParams[key]);
            this._productoService.buscarCompras(Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&'), idOrigen).subscribe(data => {
                this.listCompras = data;
                this.toastr.success('Búsqueda realizada', 'Correcto');

            }, error => {
                console.log(JSON.stringify(error));
                this.toastr.error((error as any).statusText, 'Error');
                this.actualizar();
            });
            this.pidiendoID = false;
        });
    }

    hacerEditarCompra(id: string) {
        this.editandoCompra = true;

        let data = this.listCompras.find(compra => compra._id === id);
        this.editarCompraForm.setValue({
            _id: data?._id,
            nombreComprador: data?.nombreComprador,
            direccion: data?.direccion,
        });
    }

    editarCompra() {
        this.pedirID(() => {
            const idOrigen = this.sesionForm.get('id')?.value;
            let COMPRA = this.editarCompraForm.value;
            try {
                this._productoService.editarCompra(COMPRA._id, COMPRA, idOrigen).subscribe(data => {
                    this.toastr.success('Compra editada', 'Correcto');
                    this.actualizar();

                }, error => {
                    console.log(JSON.stringify(error));
                    this.toastr.error((error as any).statusText, 'Error');
                    this.actualizar();
                });
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.actualizar();
            }
        });
    }

    eliminarCompra(id: any) {
        this.pedirID(() => {
            const idOrigen = this.sesionForm.value.id;
            try {
                this._productoService.eliminarCompra(id, idOrigen).subscribe(data => {
                    this.toastr.info('La compra fue eliminado con exito', 'COMPRA ELIMINADO!');
                    this.actualizar();

                }, error => {
                    console.log(JSON.stringify(error));
                    this.toastr.error((error as any).statusText, 'Error');
                    this.actualizar();
                });
            } catch (error) {
                this.toastr.error((error as any).statusText, 'Error');
                this.actualizar();
            }
        });
    }
}

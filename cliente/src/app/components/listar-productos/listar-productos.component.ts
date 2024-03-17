import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

@Component({
    selector: 'app-listar-productos',
    templateUrl: './listar-productos.component.html',
    styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements OnInit {

    listProductos: Producto[] = [];
    query: string | null;

    constructor(
        private _productoService: ProductoService,
        private toastr: ToastrService,
        private route: ActivatedRoute // Inject ActivatedRoute
    ) {
        this.query = this.route.snapshot.paramMap.get('query');
    }
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
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
}

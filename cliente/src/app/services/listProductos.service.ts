import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductoDataService {
    private _listProductos: BehaviorSubject<Producto[]> = new BehaviorSubject<Producto[]>([]);
    public readonly listProductos: Observable<Producto[]> = this._listProductos.asObservable();

    constructor() { }

    setListProductos(productos: Producto[]): void {
        this._listProductos.next(productos);
    }

    getListProductos(): Producto[] {
        return this._listProductos.getValue();
    }
}

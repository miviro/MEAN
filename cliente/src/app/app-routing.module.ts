import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';
import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';

const routes: Routes = [
    { path: 'admin', component: ListarProductosComponent },
    { path: 'admin', component: ListarProductosComponent, pathMatch: 'full' },
    { path: 'admin/crear-producto', component: CrearProductoComponent },
    { path: 'admin/editar-producto/:id', component: CrearProductoComponent },
    { path: 'admin/buscar-producto/:busca', component: CrearProductoComponent },
    { path: '**', redirectTo: 'admin', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

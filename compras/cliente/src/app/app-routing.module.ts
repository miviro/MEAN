import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ComprasComponent } from './components/compras/compras.component';

const routes: Routes = [
    { path: 'compras', component: ComprasComponent, pathMatch: 'full' },
    { path: '**', redirectTo: 'compras', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ComprasComponent } from './components/compras/compras.component';

const routes: Routes = [
    { path: 'admin', component: ComprasComponent, pathMatch: 'full' },
    { path: '**', redirectTo: 'admin', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

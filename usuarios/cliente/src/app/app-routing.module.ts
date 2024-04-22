import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ListarUsuariosComponent } from './components/usuarios/usuarios';

const routes: Routes = [
    { path: 'admin', component: ListarUsuariosComponent, pathMatch: 'full' },
    { path: '**', redirectTo: 'admin', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

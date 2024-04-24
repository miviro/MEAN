import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { ListarUsuariosComponent } from './components/usuarios/usuarios';

const routes: Routes = [
    { path: 'usuarios', component: ListarUsuariosComponent, pathMatch: 'full' },
    { path: '**', redirectTo: 'usuarios', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

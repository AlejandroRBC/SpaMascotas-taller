import { Routes } from '@angular/router';
import { Access } from './access';
import { Registro } from './registro';
import { Recuperar } from './recuperar';
import { Empleado } from './empleado';
import { Cliente } from './cliente';
import { Login } from './login';

export default [
    { path: 'access', component: Access },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'recuperar', component: Recuperar },
    { path: 'empleado', component: Empleado },
    { path: 'cliente', component: Cliente }
] as Routes;

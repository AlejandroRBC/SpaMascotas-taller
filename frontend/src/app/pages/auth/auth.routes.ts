import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Registro } from './registro';
import { Recuperar } from './recuperar';
import { Empleado } from './empleado';
import { Cliente } from './cliente';
import { Restablecer } from './restablecer';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'recuperar', component: Recuperar },
    { path: 'restablecer', component: Restablecer },
    { path: 'empleado', component: Empleado },
    { path: 'cliente', component: Cliente }
] as Routes;

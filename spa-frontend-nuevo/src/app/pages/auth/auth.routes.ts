import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Registro } from './registro';
import { Recuperar } from './recuperar';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'recuperar', component: Recuperar }
] as Routes;

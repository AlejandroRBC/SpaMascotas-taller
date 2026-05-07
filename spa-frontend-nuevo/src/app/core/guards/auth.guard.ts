import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard que protege rutas — si no hay sesión activa, manda al login
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.estaAutenticado()) {
        return true; // tiene token → puede entrar
    }

    // No tiene token → lo mandamos al login
    return router.createUrlTree(['/auth/login']);
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Ajuste o caminho se necessário

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se o usuário está autenticado usando o signal do AuthService
  if (authService.isAuthenticated()()) { // Chama o signal para obter o valor booleano
    return true; // Permite o acesso à rota
  } else {
    // Usuário não autenticado, redireciona para a página de login
    console.warn('Acesso negado pela guarda de rota. Redirecionando para /login.');
    router.navigate(['/login']);
    return false; // Bloqueia o acesso à rota
  }
};
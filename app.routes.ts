import { Routes } from '@angular/router';
// import { ExpensesPageComponent } from './components/expenses-page/expenses-page'; // Se estiver usando component e não loadComponent
// import { LoginPageComponent } from './pages/login-page/login-page'; // Se estiver usando component e não loadComponent
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPageComponent), // Ajuste se o nome do arquivo for .component.ts
    title: 'Login - Stitch Expenses'
  },
  { // NOVA ROTA PARA REGISTRO
    path: 'register',
    loadComponent: () => import('./pages/register-page/register-page').then(m => m.RegisterPageComponent), // Ajuste se o nome do arquivo for .component.ts
    title: 'Registro - Stitch Expenses'
  },
  {
    path: 'despesas',
    loadComponent: () => import('./components/expenses-page/expenses-page').then(m => m.ExpensesPageComponent), // Ajuste o caminho/nome
    title: 'Minhas Despesas',
    canActivate: [authGuard]
  },
  {
    path: 'graficos',
    loadComponent: () => import('../pages/charts-page/charts-page').then(m => m.ChartsPageComponent), // Lembre-se do '../' se app.routes.ts está em /app e charts-page em /pages
    title: 'Gráficos de Despesas',
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/despesas',
    pathMatch: 'full'
  },
  {
    path: '**', // Rota curinga
    // Se não autenticado, será pego pelo authGuard em /despesas e redirecionado para /login.
    // Ou pode redirecionar para uma página 'NotFound' ou para '/login' diretamente.
    redirectTo: '/despesas'
  }
];
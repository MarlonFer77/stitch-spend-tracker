import { Component, inject } from '@angular/core'; // Adicione inject se não estiver lá
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // NgForm para o form
import { Router, RouterLink } from '@angular/router'; // RouterLink para o link de registro
import { AuthService } from '../../services/auth'; // Ajuste o caminho

// Importações do Angular Material (já devem estar lá)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink, // Adicionado para o link "Não tem uma conta?"
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-page.html', // ou ./login-page.html
  styleUrls: ['./login-page.css']   // ou ./login-page.css
})
export class LoginPageComponent {
  username = ''; // Manteremos 'username' para o campo, mas ele será o 'email' para o Firebase
  password = '';
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  // Método onLogin agora é async
  async onLogin(form?: NgForm): Promise<void> {
    if (form && form.invalid) {
      this.errorMessage = 'Por favor, preencha o email e a senha.';
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // O 'username' do formulário será usado como 'email' para o Firebase
      const user = await this.authService.login(this.username, this.password);
      this.isLoading = false;

      if (user) {
        // Login bem-sucedido, Firebase AuthStateChanged já atualizou o estado global
        this.router.navigate(['/despesas']); // Redireciona para a página principal
      } else {
        // Falha no login (AuthService retorna null ou lança erro que seria pego no catch)
        // O AuthService já loga o erro específico do Firebase no console.
        this.errorMessage = 'Email ou senha inválidos. Tente novamente.';
        this.password = ''; // Limpa o campo de senha
      }
    } catch (error: any) {
      this.isLoading = false;
      console.error('Erro pego no componente de login:', error);
      // Mapear códigos de erro do Firebase para mensagens amigáveis
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.errorMessage = 'Email ou senha inválidos.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'O formato do email é inválido.';
      } else {
        this.errorMessage = 'Ocorreu um erro inesperado durante o login. Tente novamente.';
      }
      this.password = ''; // Limpa o campo de senha
    }
  }
}
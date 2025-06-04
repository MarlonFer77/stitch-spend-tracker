import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // NgForm para acessar o formulário
import { Router, RouterLink } from '@angular/router'; // RouterLink para o link de login
import { AuthService } from '../../services/auth'; // Ajuste o caminho

// Importações do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatIconModule } from '@angular/material/icon'; // Se for usar ícones nos campos

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink, // Para o link "Faça login aqui!"
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    // MatIconModule
  ],
  templateUrl: './register-page.html', 
  styleUrls: ['./register-page.css']    
})
export class RegisterPageComponent {
  displayName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  async onRegister(form?: NgForm): Promise<void> { // form opcional se não for usar suas propriedades diretamente
    if (form && form.invalid) { // Verifica se o formulário Angular é inválido
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      // Marca todos os campos como "touched" para exibir mensagens de erro se necessário
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }


    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.register(this.email, this.password, this.displayName.trim() || undefined);
      this.isLoading = false;

      if (user) {
        // Registro e login (automático pelo Firebase) bem-sucedidos
        this.router.navigate(['/despesas']); // Redireciona para a página principal
      } else {
        // Erro retornado pelo AuthService (já logado no console pelo serviço)
        // Tenta pegar uma mensagem mais amigável baseada no erro do Firebase
        this.errorMessage = 'Falha no registro. Verifique os dados ou tente um email diferente.';
      }
    } catch (error: any) {
      this.isLoading = false;
      console.error('Erro pego no componente de registro:', error);
      // Mapear códigos de erro do Firebase para mensagens amigáveis
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Este email já está em uso. Tente outro.';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'A senha é muito fraca. Tente uma senha mais forte.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'O formato do email é inválido.';
      } else {
        this.errorMessage = 'Ocorreu um erro inesperado durante o registro. Tente novamente.';
      }
    }
  }
}
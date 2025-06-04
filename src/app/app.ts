import { Component, Signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth'; // Ajuste o caminho se necessário
import { CommonModule } from '@angular/common';

// Importações do Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // Para dicas nos botões de ícone

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,   // Adicionado
    MatButtonModule,    // Adicionado
    MatIconModule,      // Adicionado
    MatTooltipModule    // Adicionado
  ],
  templateUrl: './app.html', // ou ./app.component.html
  styleUrls: ['./app.css']    // ou ./app.component.css
})
export class AppComponent {
  title = 'stitch-expense-tracker';
  currentYear: number = new Date().getFullYear();

  // Injeta o AuthService
  private authService = inject(AuthService);

  // Signals para usar no template
  isAuthenticated: Signal<boolean>;
  currentUserName: Signal<string | null>;

  constructor() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUserName = this.authService.getCurrentUserDisplayName();
  }

  logout(): void {
    this.authService.logout();

  }
}
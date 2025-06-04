import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CurrencyPipe para formatar o valor
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // MAT_DIALOG_DATA para receber dados, MatDialogModule para diretivas de diálogo
import { MatButtonModule } from '@angular/material/button'; // Para o botão de fechar
import { MatIconModule } from '@angular/material/icon'; // Opcional, para ícones

export interface ChartDialogData {
  categoryName: string;
  categoryValue: number;
  // fullMessage?: string; // Podemos passar a mensagem completa ou montar aqui
}

@Component({
  selector: 'app-chart-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe, // Adicionado
    MatDialogModule, // Para mat-dialog-title, content, actions
    MatButtonModule, // Para mat-button
    MatIconModule   // Opcional
  ],
  templateUrl: './chart-detail-dialog.html', // ou .html
  styleUrls: ['./chart-detail-dialog.css']    // ou .css
})
export class ChartDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ChartDetailDialogComponent>, // Para controlar o diálogo (ex: fechar)
    @Inject(MAT_DIALOG_DATA) public data: ChartDialogData // Dados injetados
  ) {}

  onOkClick(): void {
    this.dialogRef.close(); // Fecha o diálogo
  }
}
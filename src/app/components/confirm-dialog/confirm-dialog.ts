import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Definir textos padrão para os botões se não forem fornecidos
    this.data.confirmButtonText = this.data.confirmButtonText || 'Excluir';
    this.data.cancelButtonText = this.data.cancelButtonText || 'Cancelar';
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Retorna true se confirmado
  }

  onDismiss(): void {
    this.dialogRef.close(false); // Retorna false se cancelado
  }
}
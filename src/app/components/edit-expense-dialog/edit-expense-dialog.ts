import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Opcional: se for editar data
import { MatNativeDateModule } from '@angular/material/core';      // Opcional: se for editar data

import { Expense } from '../../models/expense.model'; // Importe o modelo Expense
import { EXPENSE_CATEGORIES } from '../expenses-page/expenses-page'; // Importe as categorias

export interface EditExpenseDialogData {
  expense: Expense;
}

@Component({
  selector: 'app-edit-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    // MatDatepickerModule, // Descomente se quiser editar a data
    // MatNativeDateModule  // Descomente se quiser editar a data
  ],
  templateUrl: './edit-expense-dialog.html',
  styleUrls: ['./edit-expense-dialog.css']
})
export class EditExpenseDialogComponent implements OnInit {
  editableExpense: Expense; // Uma cópia da despesa para edição
  availableCategories: string[] = EXPENSE_CATEGORIES;

  constructor(
    public dialogRef: MatDialogRef<EditExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditExpenseDialogData
  ) {
    // Cria uma cópia da despesa para evitar modificar o objeto original diretamente
    // até que "Salvar" seja clicado.
    // Converte a string de data de volta para objeto Date se necessário para MatDatepicker
    this.editableExpense = { ...data.expense, date: new Date(data.expense.date) };
  }

  ngOnInit(): void {
    if (!this.editableExpense.category && this.availableCategories.length > 0) {
      // Define uma categoria padrão se a despesa não tiver uma (improvável se já é salva com categoria)
      // Ou simplesmente deixe como está se a categoria puder ser nula/undefined na edição
    }
  }

  onSave(): void {
    if (this.editableExpense.description.trim() &&
        this.editableExpense.amount > 0 &&
        this.editableExpense.category) {
      this.dialogRef.close(this.editableExpense); // Retorna a despesa modificada
    } else {
      // Poderia adicionar uma mensagem de erro no diálogo
      console.error("Dados inválidos para salvar a despesa.");
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Fecha o diálogo sem retornar dados
  }
}
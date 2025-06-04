import { Component, OnInit, WritableSignal, computed, Signal, ViewChild, AfterViewInit, effect, inject } from '@angular/core'; // Adicione inject
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router'; // Removido se não usado

// Serviços e Modelos
import { ExpenseService } from '../../services/expense';
import { Expense } from '../../models/expense.model';
import { IncomeService } from '../../services/income'; // Importe o IncomeService
import { Income } from '../../models/income.model';   // Importe o Income model

// Componentes Filhos
import { StitchComponent } from '../stitch/stitch';

// Constantes
export const EXPENSE_CATEGORIES: string[] = [
  'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros',
];

// Importações do Angular Material (existentes e novas se necessário)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog'; 
import { EditExpenseDialogComponent, EditExpenseDialogData } from '../edit-expense-dialog/edit-expense-dialog';

@Component({
  selector: 'app-expenses-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // RouterLink,
    CurrencyPipe,
    DatePipe,
    StitchComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule
    // MatListModule // Opcional
  ],
  templateUrl: './expenses-page.html',
  styleUrls: ['./expenses-page.css']
})
export class ExpensesPageComponent implements OnInit, AfterViewInit {
  // Propriedades para formulário de Despesa (existentes)
  newExpenseDescription: string = '';
  newExpenseAmount: number | null = null;
  newExpenseCategory: string = '';
  isLoadingAddExpense = false;
  availableCategories: string[] = EXPENSE_CATEGORIES;

  // NOVAS Propriedades para formulário de Receita
  newIncomeDescription: string = '';
  newIncomeAmount: number | null = null;
  isLoadingAddIncome = false;

  // Signals de Despesa (existentes)
  public expensesSignal: Signal<Expense[]>;
  totalExpenses: Signal<number>;

  // NOVOS Signals de Receita e Saldo
  // myIncomes: Signal<Income[]>; // Opcional: para listar receitas
  totalIncome: Signal<number>;
  currentBalance: Signal<number>;

  // Propriedades da MatTable (existentes)
  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];
  dataSource: MatTableDataSource<Expense>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  feedbackMessage: string = '';

  private dialog = inject(MatDialog);
  private incomeService = inject(IncomeService);

  constructor(private expenseService: ExpenseService) {
    // Despesas
    this.expensesSignal = this.expenseService.getExpensesForCurrentUser();
    this.totalExpenses = this.expenseService.getTotalExpensesForCurrentUser();
    this.dataSource = new MatTableDataSource<Expense>([]);

    // Receitas
    // this.myIncomes = this.incomeService.getIncomesForCurrentUser(); // Opcional
    this.totalIncome = this.incomeService.getTotalIncomeForCurrentUser();

    // Saldo
    this.currentBalance = computed(() => this.totalIncome() - this.totalExpenses());

    // Effect para atualizar dataSource da MatTable de despesas
    effect(() => {
      const currentExpenses = this.expensesSignal();
      this.dataSource.data = currentExpenses;
      if (this.dataSource.paginator !== this.paginator && this.paginator) {
         this.dataSource.paginator = this.paginator;
      }
      if (this.dataSource.sort !== this.sort && this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngOnInit(): void {
    if (this.availableCategories.length > 0 && !this.newExpenseCategory) {
      this.newExpenseCategory = this.availableCategories[0];
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // Método para adicionar Despesa (existente)
  addExpense(): void {
    if (this.newExpenseDescription.trim() && this.newExpenseAmount !== null && this.newExpenseAmount > 0 && this.newExpenseCategory) {
      this.isLoadingAddExpense = true;
      setTimeout(() => {
        this.expenseService.addExpense(this.newExpenseDescription, this.newExpenseAmount!, this.newExpenseCategory);
        this.newExpenseDescription = '';
        this.newExpenseAmount = null;
        if (this.availableCategories.length > 0) this.newExpenseCategory = this.availableCategories[0];
        this.showFeedback('Despesa adicionada com sucesso! ✅');
        this.isLoadingAddExpense = false;
      }, 300);
    } else {
      this.showFeedback('Por favor, preencha descrição, valor válido e selecione uma categoria. ⚠️', 'error');
    }
  }

  // NOVO Método para adicionar Receita
  addIncome(): void {
    if (this.newIncomeDescription.trim() && this.newIncomeAmount !== null && this.newIncomeAmount > 0) {
      this.isLoadingAddIncome = true;
      setTimeout(() => { // Simulação de delay
        const success = this.incomeService.addIncome(this.newIncomeDescription, this.newIncomeAmount!);
        if (success) {
          this.newIncomeDescription = '';
          this.newIncomeAmount = null;
          this.showFeedback('Receita adicionada com sucesso! 💰');
        } else {
          // O serviço já loga o erro, podemos adicionar feedback visual se quisermos
          this.showFeedback('Erro ao adicionar receita. Verifique os dados ou se está logado.', 'error');
        }
        this.isLoadingAddIncome = false;
      }, 300);
    } else {
      this.showFeedback('Por favor, preencha a descrição e um valor válido para a receita. ⚠️', 'error');
    }
  }

  // Método para limpar Despesas (existente)
  clearAllExpenses(): void {
    this.expenseService.clearMyExpenses();
    this.showFeedback('Suas despesas foram removidas. 🗑️');
  }

  private showFeedback(message: string, type: 'success' | 'error' = 'success'): void {
    this.feedbackMessage = message;
    setTimeout(() => {
      this.feedbackMessage = '';
    }, 3000);
  }

  openDeleteConfirmDialog(expense: Expense): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza de que deseja excluir a despesa "${expense.description}" no valor de ${new CurrencyPipe('pt-BR').transform(expense.amount, 'BRL', 'symbol', '1.2-2')}?`,
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar'
      },
      panelClass: 'dark-theme-dialog-panel',
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { // Se o usuário clicou em "Excluir"
        const deleted = this.expenseService.deleteExpense(expense.id);
        if (deleted) {
          this.showFeedback('Despesa excluída com sucesso! 🗑️');
          // O dataSource da MatTable será atualizado automaticamente pelo effect que observa o expensesSignal.
        } else {
          this.showFeedback('Erro ao excluir despesa. Não encontrada ou não pertence a você.', 'error');
        }
      }
    });
  }

    openEditDialog(expenseToEdit: Expense): void {
    const dialogRef = this.dialog.open(EditExpenseDialogComponent, {
      width: '450px', // Ou a largura que preferir
      data: { expense: { ...expenseToEdit } },
      panelClass: 'dark-theme-dialog-panel',
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Se o diálogo retornou dados (ou seja, o usuário clicou em "Salvar")
        const updatedExpense = result as Expense; // O resultado é a despesa atualizada
        const success = this.expenseService.updateExpense(updatedExpense);
        if (success) {
          this.showFeedback('Despesa atualizada com sucesso! ✨');
          // O dataSource da MatTable será atualizado automaticamente pelo effect
        } else {
          this.showFeedback('Erro ao atualizar despesa.', 'error');
        }
      }
    });
  }
}
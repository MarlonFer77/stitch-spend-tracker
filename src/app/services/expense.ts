import { Injectable, WritableSignal, signal, computed, Signal, inject, effect } from '@angular/core'; // Adicione inject
import { Expense } from '../models/expense.model';
import { AuthService } from './auth';

const LOCAL_STORAGE_KEY = 'myExpenses_v2'; // Mudei a chave para evitar conflito com dados antigos sem userId

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private authService = inject(AuthService); // Injete AuthService
  private allExpensesSignal: WritableSignal<Expense[]> = signal<Expense[]>([]);
  private currentUserIdSignal: Signal<string | null> = this.authService.getCurrentUserId();

  constructor() {
    const storedExpenses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedExpenses) {
      try {
        this.allExpensesSignal.set(JSON.parse(storedExpenses).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        })));
      } catch (e) {
        console.error('Erro ao parsear despesas do localStorage', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Salva todas as despesas no localStorage sempre que allExpensesSignal mudar
    effect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.allExpensesSignal()));
    });
  }

  // Signal computado que retorna APENAS as despesas do usuário logado
  getExpensesForCurrentUser(): Signal<Expense[]> {
    return computed(() => {
      const userId = this.currentUserIdSignal();
      if (!userId) return []; // Se não há usuário logado, retorna array vazio
      return this.allExpensesSignal().filter(expense => expense.userId === userId);
    });
  }

  addExpense(description: string, amount: number, category: string): void {
    const userId = this.currentUserIdSignal();
    if (!userId) {
      console.error('Nenhum usuário logado para adicionar despesa.');
      // Poderia exibir uma mensagem para o usuário ou redirecionar para o login
      return;
    }

    if (!description.trim() || isNaN(amount) || amount <= 0 || !category) {
      console.error('Dados inválidos para despesa.');
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount,
      date: new Date(),
      category,
      userId: userId // Associa a despesa ao usuário logado
    };
    this.allExpensesSignal.update(expenses => [...expenses, newExpense]);
  }

  // Total de despesas APENAS para o usuário logado
  getTotalExpensesForCurrentUser(): Signal<number> {
    return computed(() => {
      return this.getExpensesForCurrentUser()().reduce((total, expense) => total + expense.amount, 0);
    });
  }

  // Despesas agrupadas por categoria APENAS para o usuário logado
  getExpensesGroupedByCategoryForCurrentUser(): Signal<{ name: string; value: number }[]> {
    return computed(() => {
      const grouped: { [key: string]: number } = {};
      this.getExpensesForCurrentUser()().forEach(expense => {
        if (expense.category) {
          if (grouped[expense.category]) {
            grouped[expense.category] += expense.amount;
          } else {
            grouped[expense.category] = expense.amount;
          }
        }
      });
      const result = Object.entries(grouped).map(([name, value]) => ({ name, value }));
      return result;
    });
  }

  // Limpa APENAS as despesas do usuário logado
  clearMyExpenses(): void {
    const userId = this.currentUserIdSignal();
    if (!userId) {
      console.error('Nenhum usuário logado para limpar despesas.');
      return;
    }
    this.allExpensesSignal.update(expenses => expenses.filter(expense => expense.userId !== userId));
  }
  deleteExpense(expenseId: string): boolean {
    const userId = this.currentUserIdSignal();
    if (!userId) {
      console.error('Nenhum usuário logado para deletar despesa.');
      return false;
    }

    let expenseFoundAndDeleted = false;
    this.allExpensesSignal.update(expenses => {
      const initialLength = expenses.length;
      const filteredExpenses = expenses.filter(expense => {
        // Mantém a despesa se o ID não bate OU se o ID bate mas o userId não é do usuário logado
        return !(expense.id === expenseId && expense.userId === userId);
      });
      expenseFoundAndDeleted = filteredExpenses.length < initialLength;
      return filteredExpenses;
    });

    if (expenseFoundAndDeleted) {
      console.log('Despesa deletada:', expenseId, 'para o usuário:', userId);
    } else {
      console.warn('Despesa não encontrada ou não pertence ao usuário para deleção:', expenseId, userId);
    }
    return expenseFoundAndDeleted;
  }

  updateExpense(updatedExpense: Expense): boolean {
    const userId = this.currentUserIdSignal();
    if (!userId || updatedExpense.userId !== userId) {
      console.error('Não autorizado a atualizar esta despesa ou ID de usuário inválido.');
      return false;
    }

    let expenseUpdated = false;
    this.allExpensesSignal.update(expenses => {
      const index = expenses.findIndex(exp => exp.id === updatedExpense.id && exp.userId === userId);
      if (index !== -1) {
        const expensesCopy = [...expenses]; // Cria uma cópia para imutabilidade
        expensesCopy[index] = { ...updatedExpense, userId: userId }; // Garante que o userId não seja alterado indevidamente
        expenseUpdated = true;
        return expensesCopy;
      }
      return expenses; // Retorna o array original se não encontrou
    });

    if (expenseUpdated) {
      console.log('Despesa atualizada:', updatedExpense.id, 'para o usuário:', userId);
    } else {
      console.warn('Despesa não encontrada para atualização ou não pertence ao usuário:', updatedExpense.id);
    }
    return expenseUpdated;
  }

}
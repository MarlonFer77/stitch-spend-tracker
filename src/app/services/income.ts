import { Injectable, WritableSignal, signal, computed, Signal, inject, effect } from '@angular/core';
import { Income } from '../models/income.model'; // Importa o modelo Income
import { AuthService } from './auth';

const LOCAL_STORAGE_KEY_INCOMES = 'myIncomes_v1'; // Chave para o localStorage de receitas

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private authService = inject(AuthService);

  // Signal com TODAS as receitas de TODOS os usuários (lidas do localStorage)
  private allIncomesSignal: WritableSignal<Income[]> = signal<Income[]>([]);

  // Signal computado para o ID do usuário atual
  private currentUserIdSignal: Signal<string | null> = this.authService.getCurrentUserId();

  constructor() {
    // Carrega receitas do localStorage ao iniciar
    const storedIncomes = localStorage.getItem(LOCAL_STORAGE_KEY_INCOMES);
    if (storedIncomes) {
      try {
        this.allIncomesSignal.set(JSON.parse(storedIncomes).map((income: any) => ({
          ...income,
          date: new Date(income.date) // Garante que a data é um objeto Date
        })));
      } catch (e) {
  
        localStorage.removeItem(LOCAL_STORAGE_KEY_INCOMES);
      }
    }

    // Salva todas as receitas no localStorage sempre que allIncomesSignal mudar
    effect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY_INCOMES, JSON.stringify(this.allIncomesSignal()));
    });
  }

  // Adiciona uma nova receita para o usuário logado
  addIncome(description: string, amount: number): boolean {
    const userId = this.currentUserIdSignal();
    if (!userId) {
      console.error('Nenhum usuário logado para adicionar receita.');
      // Idealmente, o UI não permitiria chegar aqui sem usuário logado
      return false;
    }

    if (!description.trim() || isNaN(amount) || amount <= 0) {
      console.error('Dados inválidos para receita. Descrição e valor positivo são obrigatórios.');
      return false;
    }

    const newIncome: Income = {
      id: crypto.randomUUID(),
      description,
      amount,
      date: new Date(),
      userId: userId
    };

    this.allIncomesSignal.update(incomes => [...incomes, newIncome]);
    return true;
  }

  // Retorna um Signal APENAS com as receitas do usuário logado
  getIncomesForCurrentUser(): Signal<Income[]> {
    return computed(() => {
      const userId = this.currentUserIdSignal();
      if (!userId) return [];
      return this.allIncomesSignal().filter(income => income.userId === userId);
    });
  }

  // Retorna um Signal com o TOTAL de receitas APENAS para o usuário logado
  getTotalIncomeForCurrentUser(): Signal<number> {
    return computed(() => {
      return this.getIncomesForCurrentUser()().reduce((total, income) => total + income.amount, 0);
    });
  }


  clearMyIncomes(): void {
    const userId = this.currentUserIdSignal();
    if (!userId) {
      console.error('Nenhum usuário logado para limpar receitas.');
      return;
    }
    this.allIncomesSignal.update(incomes => incomes.filter(income => income.userId !== userId));
  }

}
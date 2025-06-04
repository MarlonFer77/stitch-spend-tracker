import { Component, Input, computed, Signal, OnChanges, SimpleChanges, WritableSignal, signal } from '@angular/core'; // Adicione WritableSignal, signal
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stitch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stitch-container">
      <img [src]="stitchImageUrl()" alt="Stitch Mascot" />
      <p class="stitch-status">{{ stitchStatus() }}</p>
    </div>
  `,
  styleUrls: ['./stitch.css'], // Verifique se o nome do arquivo CSS está correto aqui, antes era stitch.css
})
export class StitchComponent implements OnChanges {
  // Renomeei o Input para clareza e para evitar conflito com o nome do signal interno
  @Input({ required: true }) totalExpensesInput: number = 0;

  // Signal interno que vai espelhar o valor do Input
  private currentTotalExpenses: WritableSignal<number> = signal(0);

  constructor() {
    // Opcional: definir o valor inicial do signal se totalExpensesInput já tiver um valor aqui,
    // mas ngOnChanges cuidará disso de qualquer forma.
    // this.currentTotalExpenses.set(this.totalExpensesInput);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica se o input 'totalExpensesInput' mudou
    if (changes['totalExpensesInput']) {
      const newTotal = changes['totalExpensesInput'].currentValue;
      console.log(`[StitchComponent - ngOnChanges] totalExpensesInput mudou para: ${newTotal}`);
      this.currentTotalExpenses.set(newTotal); // ATUALIZA O SIGNAL INTERNO
    }
  }

  // Agora os computed signals dependem do 'currentTotalExpenses' (que é um signal)
  stitchImageUrl: Signal<string> = computed(() => {
    const total = this.currentTotalExpenses(); // Lê o valor do signal interno
    console.log(`[StitchComponent - computed stitchImageUrl] Calculando com currentTotalExpenses: ${total}`);
    if (total < 500) {
      return 'assets/stitch-feliz.png';
    } else if (total >= 500 && total <= 999) {
      return 'assets/stitch-triste.png';
    } else {
      return 'assets/stitch-bravo.png';
    }
  });

  stitchStatus: Signal<string> = computed(() => {
    const total = this.currentTotalExpenses(); // Lê o valor do signal interno
    console.log(`[StitchComponent - computed stitchStatus] Calculando com currentTotalExpenses: ${total}`);
    if (total < 500) {
      return 'Stitch está feliz! 😄';
    } else if (total >= 500 && total <= 999) {
      return 'Stitch está um pouco triste... 😟';
    } else {
      return 'Stitch está bravo com tantos gastos! 😠';
    }
  });
}
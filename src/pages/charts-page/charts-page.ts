import { Component, OnInit, Signal, computed, inject } from '@angular/core'; // Removido 'effect' se não estiver usando os logs de effect
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { RouterLink } from '@angular/router';

// Importe ActiveElement junto com os outros tipos do Chart.js
import { Chart, PieController, ArcElement, Legend, Tooltip, ChartConfiguration, ChartData, ChartEvent, ChartType, ActiveElement } from 'chart.js';

import { ExpenseService } from '../../app/services/expense'; // Verifique o caminho

// Importação do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Para MatDialog
import { ChartDetailDialogComponent } from '../../app/components/chart-detail-dialog/chart-detail-dialog';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    RouterLink,
    MatCardModule,
    MatDialogModule // Adicionado para MatDialog
  ],
  templateUrl: './charts-page.html',
  styleUrls: ['./charts-page.css']
})
export class ChartsPageComponent implements OnInit {
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#FFFF00'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  public pieChartLabels: Signal<string[]> = computed(() => {
    return this.expensesGroupedByCategory().map(item => item.name);
  });

  public pieChartData: Signal<ChartData<'pie', number[], string | string[]>> = computed(() => {
    const labels = this.pieChartLabels();
    const dataValues = this.expensesGroupedByCategory().map(item => item.value);
    return {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FFCD56', '#C9CBCF', '#7CFC00', '#FFD700', '#ADFF2F', '#FF00FF'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FFCD56', '#C9CBCF', '#7CFC00', '#FFD700', '#ADFF2F', '#FF00FF'
        ],
        borderColor: '#000000',
        hoverBorderColor: '#333333'
      }]
    };
  });

  public expensesGroupedByCategory: Signal<{ name: string; value: number }[]>;

  // Injetando MatDialog
  private dialog = inject(MatDialog);

  constructor(private expenseService: ExpenseService) {
    Chart.register(PieController, ArcElement, Legend, Tooltip);
    this.expensesGroupedByCategory = this.expenseService.getExpensesGroupedByCategoryForCurrentUser();

    // effect(() => { // Logs de depuração, podem ser removidos
    //   const data = this.expensesGroupedByCategory();
    //   console.log('[ChartsPageComponent] expensesGroupedByCategory ATUALIZADO:', data);
    // });
  }

  ngOnInit(): void {
    // console.log('Chart page initialized.');
  }

  // CORREÇÃO: Assinatura de 'active' ajustada para object[] e asserção de tipo interna
  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // console.log('Chart clicked (raw):', { event, active });

    if (active && active.length > 0) {
      const activeElements = active as ActiveElement[]; // Asserção de tipo
      const clickedElement = activeElements[0];

      if (clickedElement && typeof clickedElement.index === 'number' && typeof clickedElement.datasetIndex === 'number') {
        const datasetIndex = clickedElement.datasetIndex;
        const clickedSegmentIndex = clickedElement.index;

        const labels = this.pieChartLabels();
        const chartDataResult = this.pieChartData(); // Obtenha o objeto ChartData
        const dataPoints = chartDataResult?.datasets?.[datasetIndex]?.data;

        if (labels && dataPoints && clickedSegmentIndex !== undefined &&
            labels[clickedSegmentIndex] !== undefined && dataPoints[clickedSegmentIndex] !== undefined) {
          
          const categoryName = labels[clickedSegmentIndex];
          const categoryValue = dataPoints[clickedSegmentIndex] as number;

          this.dialog.open(ChartDetailDialogComponent, {
            width: '400px',
            data: { categoryName, categoryValue }
            // panelClass: 'dark-theme-dialog-panel' // Para estilização de tema escuro, se definida globalmente
          });

        } else {
          console.warn('Não foi possível obter dados completos do segmento clicado para o diálogo.', {
            labelsAvailable: !!labels,
            dataPointsAvailable: !!dataPoints,
            clickedSegmentIndex
          });
        }
      } else {
        // console.warn('Elemento ativo clicado não tem a estrutura esperada de ActiveElement.');
      }
    }
  }

  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // Lógica de hover (opcional)
    // if (active && active.length > 0) {
    //   const activeElements = active as ActiveElement[];
    //   console.log('Hovering over segment index:', activeElements[0].index);
    // }
  }
}

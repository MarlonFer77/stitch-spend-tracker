<<<<<<< HEAD
# AppGastos

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
=======
# Stitch Expense Tracker  расходов TRACKER 💸

## 🎯 Sobre o Projeto (About the Project)
O Stitch Expense Tracker é um aplicativo web pessoal para controle de despesas e receitas, projetado para ajudar usuários a gerenciar suas finanças de forma simples e interativa. O grande diferencial é o nosso mascote, Stitch, que reage visualmente ao total de gastos registrados, tornando a experiência mais divertida! Este projeto foi desenvolvido com Angular (utilizando componentes standalone e Signals), Firebase para autenticação, e Angular Material para uma interface moderna e responsiva.

---

## ✨ Funcionalidades Principais (Key Features)

* **Autenticação de Usuários Segura com Firebase:**
    * Registro de novos usuários utilizando e-mail e senha.
    * Login e Logout com persistência de sessão.
    * Rotas protegidas, garantindo que apenas usuários autenticados acessem suas informações financeiras.
* **Gerenciamento Detalhado de Despesas por Usuário:**
    * Adição de novas despesas com descrição, valor monetário e categorização.
    * Listagem interativa de despesas em uma tabela Material (`MatTable`) com:
        * Paginação para grandes volumes de dados.
        * Ordenação dinâmica por qualquer coluna (data, categoria, descrição, valor).
    * Exclusão de despesas individualmente, com um diálogo de confirmação (`MatDialog`).
    * Edição de despesas existentes através de um formulário em diálogo (`MatDialog`).
    * Opção para limpar todas as despesas do usuário logado.
* **Gerenciamento de Receitas por Usuário:**
    * Adição de novas receitas/ganhos com descrição e valor.
* **Controle de Saldo Financeiro:**
    * Visualização clara do total de receitas.
    * Visualização clara do total de despesas.
    * Cálculo e exibição em tempo real do saldo atual (Receitas - Despesas).
* **Visualização de Dados com Gráficos:**
    * Página dedicada a gráficos (`ChartsPageComponent`).
    * Gráfico de Pizza (`ng2-charts`) mostrando a distribuição percentual dos gastos por categoria.
    * Interatividade no gráfico: ao clicar em uma fatia (categoria), um diálogo (`MatDialog`) exibe os detalhes daquela categoria.
* **Mascote Interativo - Stitch:**
    * O mascote Stitch, presente na página de despesas, altera sua expressão (feliz, triste, bravo) com base no montante total de despesas registradas pelo usuário.
* **Interface de Usuário Moderna e Temática:**
    * Construído com a arquitetura de Componentes Standalone do Angular (v17+).
    * Uso de Signals do Angular para gerenciamento de estado reativo e eficiente.
    * Tema visual customizado "dark" (predominantemente preto e amarelo) aplicado em toda a aplicação.
    * Ampla utilização de componentes do Angular Material (`MatToolbar`, `MatButton`, `MatFormField`, `MatInput`, `MatSelect`, `MatTable`, `MatSort`, `MatPaginator`, `MatDialog`, `MatCard`, `MatIcon`, `MatTooltip`, `MatProgressSpinner`) para uma UI rica e consistente.
    * Design com elementos responsivos para melhor adaptação a diferentes tamanhos de tela.

---

## 🛠️ Tecnologias Utilizadas (Tech Stack)

* **Frontend:**
    * Angular (v17+ / v20, conforme sua versão)
        * Componentes Standalone
        * Signals
        * TypeScript
    * Angular Material (para a maioria dos componentes de UI)
    * `ng2-charts` (Chart.js wrapper para Angular)
    * HTML5, CSS3 (com uso de `::ng-deep` para customizações pontuais do Material)
* **Autenticação:**
    * Firebase Authentication (Login e Registro por Email/Senha)
* **Armazenamento de Dados (Lado do Cliente):**
    * `localStorage` do navegador para persistir os dados de despesas e receitas, com cada registro associado ao `uid` do usuário do Firebase.

---

## 🚀 Como Executar o Projeto Localmente (Running Locally)

1.  **Pré-requisitos:**
    * Node.js (com npm ou yarn).
    * Angular CLI instalado globalmente (`npm install -g @angular/cli`).
    * Um projeto Firebase criado e configurado no [Console do Firebase](https://console.firebase.google.com/) com:
        * O serviço de **Authentication** ativado.
        * O provedor de login **"E-mail/senha"** habilitado.

2.  **Clone o Repositório (se aplicável):**
    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO
    ```

3.  **Instale as Dependências:**
    Na pasta raiz do projeto, execute:
    ```bash
    npm install
    ```

4.  **Configure as Credenciais do Firebase:**
    * Crie uma pasta `src/environments/` se ela não existir.
    * Dentro de `src/environments/`, crie dois arquivos:
        * `environment.ts`
        * `environment.prod.ts`
    * Em cada um desses arquivos, adicione o objeto de configuração do seu projeto Firebase (obtido no Console do Firebase -> Configurações do Projeto -> Seus apps -> Configuração do SDK). O conteúdo deve ser similar a:

        ```typescript
        // Exemplo para src/environments/environment.ts (e similar para environment.prod.ts)
        export const environment = {
          production: false,
          firebase: {
            apiKey: "SUA_API_KEY",
            authDomain: "SEU_PROJECT_ID.firebaseapp.com",
            projectId: "SEU_PROJECT_ID",
            storageBucket: "SEU_PROJECT_ID.appspot.com",
            messagingSenderId: "SEU_SENDER_ID",
            appId: "SEU_APP_ID",
            measurementId: "SEU_MEASUREMENT_ID" // Opcional
          }
        };
        ```
        **Substitua os placeholders pelos valores reais do seu projeto Firebase.**

5.  **Execute a Aplicação:**
    ```bash
    ng serve -o
    ```
    O aplicativo deverá estar disponível em `http://localhost:4200/`.

---

## 🔮 Próximos Passos e Melhorias Futuras (Future Enhancements)

* Implementação de um sistema de Theming SASS customizado para o Angular Material, para melhor controle de estilos e remoção de `::ng-deep`.
* Adição de mais tipos de gráficos (ex: gráfico de linha para tendências de gastos/receitas ao longo do tempo, gráfico de barras para receitas vs. despesas).
* Criação de uma página de "Dashboard" com um resumo financeiro mais visual.
* Funcionalidade de Orçamento (Budgeting) por categoria ou geral.
* Edição e exclusão de receitas individuais (similar ao que foi feito para despesas).
* Filtros mais avançados para a tabela de despesas/receitas.
* Refinamentos na responsividade e experiência do usuário.
* Persistência de dados de despesas/receitas no Firebase (Firestore ou Realtime Database) para sincronização entre dispositivos e maior robustez.

---

## 📝 Licença (License)

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

Feito com carinho e a ajuda do Stitch! 💙
>>>>>>> 90d4aec1c37af0815faacea9bc775622620c6f6d

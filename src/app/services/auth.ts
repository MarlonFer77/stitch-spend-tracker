import { Injectable, WritableSignal, signal, computed, Signal, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth'; // Importações do Firebase Auth

// Chave para o localStorage
const FIREBASE_USER_KEY = 'firebaseUserStitchApp';

export interface StoredUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth); 
  private router: Router = inject(Router);


  private currentUserSignal: WritableSignal<User | null> = signal(null);

  constructor() {
 
    const storedUserString = localStorage.getItem(FIREBASE_USER_KEY);
    if (storedUserString) {
      try {
        const storedUserData = JSON.parse(storedUserString) as StoredUser;

        this.currentUserSignal.set({ uid: storedUserData.uid, email: storedUserData.email, displayName: storedUserData.displayName } as User);
      } catch (e) {
        console.error('Erro ao parsear usuário do localStorage (Firebase)', e);
        localStorage.removeItem(FIREBASE_USER_KEY);
      }
    }

    onAuthStateChanged(this.auth, (user) => {
      console.log('[AuthService] Auth state changed. User:', user);
      if (user) {
        // Usuário está logado
        this.currentUserSignal.set(user);
        const userToStore: StoredUser = { // Armazena uma versão simplificada no localStorage
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        };
        localStorage.setItem(FIREBASE_USER_KEY, JSON.stringify(userToStore));
      } else {
        // Usuário está deslogado
        this.currentUserSignal.set(null);
        localStorage.removeItem(FIREBASE_USER_KEY);
      }
    });
  }

  // Método de Login com Firebase (retorna uma Promise)
  async login(email: string, passwordInput: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, passwordInput);
      // onAuthStateChanged irá atualizar o currentUserSignal e localStorage
      console.log('Login bem-sucedido com Firebase para:', userCredential.user.email);
      return userCredential.user;
    } catch (error: any) {
      console.error('Erro no login com Firebase:', error.message);
      this.currentUserSignal.set(null); // Garante que está deslogado no signal em caso de erro
      localStorage.removeItem(FIREBASE_USER_KEY);
      return null; // Ou poderia lançar o erro para o componente tratar
    }
  }

  // NOVO MÉTODO: Registrar um novo usuário com Firebase (retorna uma Promise)
  async register(email: string, passwordInput: string, displayName?: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, passwordInput);
      console.log('Usuário registrado com Firebase:', userCredential.user.email);
      // Opcional: Atualizar o perfil do usuário com displayName
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: displayName });
        // Atualiza o signal localmente, pois onAuthStateChanged pode não pegar o displayName imediatamente
        this.currentUserSignal.set({ ...userCredential.user, displayName } as User); 
        // E também o localStorage
        const userToStore: StoredUser = { uid: userCredential.user.uid, email: userCredential.user.email, displayName };
        localStorage.setItem(FIREBASE_USER_KEY, JSON.stringify(userToStore));

        console.log('Perfil atualizado com displayName:', displayName);
      }
      // onAuthStateChanged também será disparado, atualizando o estado globalmente.
      return userCredential.user;
    } catch (error: any) {
      console.error('Erro ao registrar usuário com Firebase:', error.message);
      return null; // Ou poderia lançar o erro
    }
  }

  // Método de Logout com Firebase
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // onAuthStateChanged cuidará de limpar currentUserSignal e localStorage
      console.log('Usuário deslogado do Firebase.');
      this.router.navigate(['/login']); // Redireciona para a página de login
    } catch (error) {
      console.error('Erro no logout com Firebase:', error);
    }
  }

  // Signal para verificar se o usuário está autenticado
  isAuthenticated(): Signal<boolean> {
    return computed(() => !!this.currentUserSignal());
  }

  // Signal para obter o objeto User do Firebase (somente leitura)
  getCurrentUser(): Signal<User | null> {
    return this.currentUserSignal.asReadonly();
  }

  // Signal para obter o UID do usuário atual (para ExpenseService e IncomeService)
  getCurrentUserId(): Signal<string | null> {
  return computed(() => this.currentUserSignal()?.uid || null);
}

  // Signal para obter o nome de exibição do usuário atual
  getCurrentUserDisplayName(): Signal<string | null> {
      return computed(() => {
        const user = this.currentUserSignal(); // Lê o signal aqui
        return user?.displayName || user?.email || null;
  });
  }
}
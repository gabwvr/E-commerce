// Componente raiz do aplicativo web
// Comentários em português, claros e simples, como de um estudante
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <header class="header" *ngIf="!isMobileMode">
      <div class="brand">
        <img src="assets/logo-cabecalho.png" alt="Logo" class="logo">
      </div>
      <nav class="nav center">
        <a routerLink="/catalogo" class="nav-link nav-primary" aria-label="Catálogo de produtos">
          <span class="material-symbols-rounded">shopping_bag</span>
          <span style="margin-left:6px; font-weight:700;">Catálogo de produtos</span>
        </a>
      </nav>
      <div class="nav-right">
        <a routerLink="/carrinho" class="icon-link" aria-label="Carrinho">
          <span class="material-symbols-rounded">shopping_cart</span>
        </a>
        <a routerLink="/login" class="icon-link" aria-label="Login">
          <span class="material-symbols-rounded">person</span>
        </a>
        <a routerLink="/mobile" class="icon-link" aria-label="App Mobile (Flutter)">
          <span class="material-symbols-rounded">smartphone</span>
        </a>
      </div>
    </header>
    <main class="main">
      <router-outlet></router-outlet>
    </main>
  `
})
export class ComponenteAplicativo {
  // Diz se o app está dentro de um iframe (simulação do celular)
  isEmbedded = false;
  // Quando true, esconde o cabeçalho para parecer um app mobile
  isMobileMode = false;

  constructor(private router: Router, private title: Title) {
    // Detecta se o app está embutido em iframe (simulação mobile)
    // Se estiver dentro de um iframe, vamos ocultar o cabeçalho
    try {
      this.isEmbedded = window.self !== window.top;
    } catch { this.isEmbedded = true; }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // Define o título da página de forma amigável
        const pageTitle = this.getRouteTitle();
        this.title.setTitle(`${pageTitle} | E-commerce`);
        const url = this.router.url || '';
        // Se a rota é /mobile, se tem ?mobile=1, ou se está embutido, ativa modo mobile
        const hasMobileQuery = url.includes('mobile=1');
        const onMobileRoute = url.startsWith('/mobile');
        this.isMobileMode = onMobileRoute || hasMobileQuery || this.isEmbedded;
      }
    });
  }

  private getRouteTitle(): string {
    // Percorre os dados da rota atual para tentar achar um título
    let snap = this.router.routerState.snapshot.root;
    while (snap.firstChild) {
      snap = snap.firstChild;
    }
    const dataTitle = (snap.data && (snap.data as any)['title']) || null;
    if (dataTitle) return dataTitle as string;
    // Plano B: cria um título baseado na URL (ex.: /catalogo => Catalogo)
    const url = snap.url?.join('/') || '';
    const path = url.replace(/^\//, '') || 'Home';
    const friendly = path.split('?')[0].split('#')[0].split('/')[0].replace(/-/g, ' ');
    return friendly.charAt(0).toUpperCase() + friendly.slice(1);
  }
}

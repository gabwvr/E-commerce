// Página de simulação do App Mobile (Flutter)
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServicoApi } from '../../services/servico-api.service';

@Component({
  selector: 'app-mobile-simulacao',
  templateUrl: './mobile-simulacao.component.html',
  styleUrls: ['./mobile-simulacao.component.css']
})
export class MobileSimulacaoComponent {
  tela: 'resumo' | 'catalogo' | 'carrinho' = 'resumo';
  itensSimulados = [
    { nome: 'Fone Bluetooth', preco: 199.90, quantidade: 1, subtotal: 199.90 },
    { nome: 'Camiseta Básica', preco: 49.90, quantidade: 2, subtotal: 99.80 },
  ];

  iframeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private api: ServicoApi) {
    // Carrega o app normal dentro da moldura, simulando uso em mobile
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/catalogo');
  }

  ir(path: string) {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

  abrirConta() {
    const destino = this.api.token ? '/minha-conta' : '/login';
    this.ir(destino);
  }
}

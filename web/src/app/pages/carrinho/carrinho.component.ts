// Tela 3: Carrinho de Compras
// Lista itens, altera quantidade, remove itens e mostra total
import { Component, OnInit } from '@angular/core';
import { ServicoApi } from '../../services/servico-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  itens: any[] = [];
  total: number = 0;
  mensagem: string | null = null;
  enderecos: any[] = [];
  enderecoSelecionado: number | null = null;

  constructor(private api: ServicoApi, private router: Router) {}

  ngOnInit(): void { this.carregar(); this.carregarEnderecos(); }

  carregar() {
    this.api.listarCarrinho().subscribe({
      next: (res) => { this.itens = res.itens; this.total = res.total; },
      error: () => this.mensagem = 'Erro ao carregar carrinho'
    });
  }

  

  carregarEnderecos() {
    this.api.listarEnderecos().subscribe({
      next: (res) => {
        this.enderecos = res || [];
        if (this.enderecos.length > 0) this.enderecoSelecionado = this.enderecos[0].id;
      },
      error: () => {}
    });
  }

  finalizarCompra() {
    this.api.finalizarCompra(this.enderecoSelecionado || undefined).subscribe({
      next: (res) => {
        this.router.navigate(['/resumo', res.pedido.numero], { state: { mensagem: 'Compra finalizada!' } });
      },
      error: () => this.mensagem = 'Erro ao finalizar'
    });
  }

  atualizar(item: any, valor: any) {
    const qtd = Math.max(1, Number(valor) || 1);
    this.api.atualizarItemCarrinho(item.id, qtd).subscribe({
      next: () => this.carregar(),
      error: () => this.mensagem = 'Erro ao atualizar quantidade'
    });
  }

  remover(item: any) {
    this.api.removerItemCarrinho(item.id).subscribe({
      next: () => this.carregar(),
      error: () => this.mensagem = 'Erro ao remover item'
    });
  }

  incrementar(item: any) { this.atualizar(item, item.quantidade + 1); }
  decrementar(item: any) { this.atualizar(item, item.quantidade - 1); }
}

// Tela 4: Nota Fiscal / Resumo do Pedido
// Mostra número do pedido, itens, total e dados de entrega
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicoApi } from '../../services/servico-api.service';

@Component({
  selector: 'app-resumo-pedido',
  templateUrl: './resumo-pedido.component.html',
  styleUrls: ['./resumo-pedido.component.css']
})
export class ResumoPedidoComponent implements OnInit {
  pedidoId!: number;
  resumo: any = null;
  mensagem: string | null = null;

  constructor(private rota: ActivatedRoute, private api: ServicoApi) {}

  ngOnInit(): void {
    this.pedidoId = Number(this.rota.snapshot.paramMap.get('id'));
    const stateMsg = (history.state && (history.state as any).mensagem) || null;
    if (stateMsg) this.mensagem = stateMsg;
    this.api.obterPedido(this.pedidoId).subscribe({
      next: (res) => this.resumo = res,
      error: () => this.mensagem = 'Erro ao carregar resumo'
    });
  }
}

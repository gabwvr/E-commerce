// Tela 2: Catálogo de Produtos
// Mostra grid de produtos com filtro por categoria
import { Component, OnInit } from '@angular/core';
import { ServicoApi } from '../../services/servico-api.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  categorias: any[] = [];
  categoriaSelecionada: number | null = null;
  produtos: any[] = [];
  mensagem: string | null = null;
  modo: 'grid' | 'lista' = 'grid';
  usarMock: boolean = false;

  private categoriasMock = [
    { id: 1, nome: 'Eletrônicos' },
    { id: 2, nome: 'Roupas' },
  ];
  private produtosMock = [
    { id: 101, nome: 'Fone Bluetooth', preco: 199.90, imagem_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_970545-MLA95687200698_102025-F.webp', categoria_id: 1 },
    { id: 102, nome: 'Câmera Action', preco: 899.00, imagem_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_830069-MLB84727353455_052025-F.webp', categoria_id: 1 },
    { id: 201, nome: 'Camiseta Básica', preco: 49.90, imagem_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_832327-MLB52270809423_112022-F-kit-5-camiseta-masculina-100-algodo-basica-treino-esporte.webp', categoria_id: 2 },
    { id: 202, nome: 'Tênis Corrida', preco: 299.00, imagem_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_811508-MLB75070240796_032024-F-tnis-nike-downshifter-13-masculino.webp', categoria_id: 2 },
  ];

  constructor(private api: ServicoApi) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarProdutos();
  }

  carregarCategorias() {
    this.api.listarCategorias().subscribe({
      next: (res) => { this.categorias = res; this.usarMock = false; },
      error: () => {
        this.mensagem = 'Erro ao carregar categorias (modo exemplo).';
        this.categorias = this.categoriasMock;
        this.usarMock = true;
      }
    });
  }

  carregarProdutos() {
    if (this.usarMock) {
      const cat = this.categoriaSelecionada;
      this.produtos = this.produtosMock.filter(p => !cat || p.categoria_id === cat);
      return;
    }
    this.api.listarProdutos(this.categoriaSelecionada || undefined).subscribe({
      next: (res) => { this.produtos = res; this.usarMock = false; },
      error: () => {
        this.mensagem = 'Erro ao carregar produtos (modo exemplo).';
        const cat = this.categoriaSelecionada;
        this.produtos = this.produtosMock.filter(p => !cat || p.categoria_id === cat);
        this.usarMock = true;
      }
    });
  }

  selecionarCategoria(id: string) {
    this.categoriaSelecionada = id ? Number(id) : null;
    this.carregarProdutos();
  }

  adicionar(produtoId: number) {
    // Exige login; se não logado, mostra aviso (pop-up simples)
    if (!this.api.token) {
      this.mensagem = 'É necessário estar logado para adicionar ao carrinho.';
      return;
    }
    // Adiciona 1 item ao carrinho
    this.api.adicionarCarrinho(produtoId, 1).subscribe({
      next: () => this.mensagem = 'Produto adicionado ao carrinho! ',
      error: () => this.mensagem = 'Erro ao adicionar'
    });
  }

  alterarModo(m: 'grid' | 'lista') { this.modo = m; }

  imagemFallback(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    // Usa um placeholder local para evitar problemas de CORS/referrer
    img.referrerPolicy = 'no-referrer';
    img.src = 'assets/logo-cabecalho.png';
  }

  nomeCategoria(c: any): string {
    const nome = (c?.nome ?? '').toString();
    return nome.replace(/\+/g, ' ');
  }
}

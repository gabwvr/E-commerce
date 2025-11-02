// Serviço centralizado para chamar a API do backend
// Comentários simples e em português para fácil entendimento
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicoApi {
  // Endereço da API (ajuste se necessário)
  apiUrl = 'http://localhost:3000/api';

  // Token do usuário logado (simples, guardado em memória)
  token: string | null = null;

  constructor(private http: HttpClient) {}

  // Helper para headers com autenticação
  private headersAuth(): HttpHeaders {
    const headers: any = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return new HttpHeaders(headers);
  }

  // Autenticação
  cadastrar(dados: any): Observable<any> {
    // Envia dados do cadastro para o backend
    return this.http.post(`${this.apiUrl}/auth/cadastrar`, dados, { headers: this.headersAuth() });
  }
  login(email: string, senha: string): Observable<any> {
    // Faz login e retorna token
    return this.http.post(`${this.apiUrl}/auth/login`, { email, senha }, { headers: this.headersAuth() });
  }

  // Catálogo
  listarCategorias(): Observable<any> {
    // Lista categorias de produtos
    return this.http.get(`${this.apiUrl}/categorias`, { headers: this.headersAuth() });
  }
  listarProdutos(categoria_id?: number): Observable<any> {
    // Lista produtos (pode filtrar por categoria)
    const url = categoria_id ? `${this.apiUrl}/produtos?categoria_id=${categoria_id}` : `${this.apiUrl}/produtos`;
    return this.http.get(url, { headers: this.headersAuth() });
  }

  // Carrinho
  listarCarrinho(): Observable<any> {
    // Obtém itens do carrinho atual
    return this.http.get(`${this.apiUrl}/carrinho`, { headers: this.headersAuth() });
  }
  adicionarCarrinho(produto_id: number, quantidade: number): Observable<any> {
    // Adiciona um produto ao carrinho
    return this.http.post(`${this.apiUrl}/carrinho/adicionar`, { produto_id, quantidade }, { headers: this.headersAuth() });
  }
  atualizarItemCarrinho(id: number, quantidade: number): Observable<any> {
    // Atualiza quantidade de um item do carrinho
    return this.http.put(`${this.apiUrl}/carrinho/item/${id}`, { quantidade }, { headers: this.headersAuth() });
  }
  removerItemCarrinho(id: number): Observable<any> {
    // Remove um item do carrinho
    return this.http.delete(`${this.apiUrl}/carrinho/item/${id}`, { headers: this.headersAuth() });
  }

  // Endereços
  listarEnderecos(): Observable<any> {
    // Lista endereços do usuário
    return this.http.get(`${this.apiUrl}/enderecos`, { headers: this.headersAuth() });
  }

  // Pedido
  finalizarCompra(endereco_id?: number): Observable<any> {
    // Finaliza a compra usando o endereço selecionado
    return this.http.post(`${this.apiUrl}/pedidos/finalizar`, { endereco_id }, { headers: this.headersAuth() });
  }
  obterPedido(id: number): Observable<any> {
    // Obtém detalhes de um pedido
    return this.http.get(`${this.apiUrl}/pedidos/${id}`, { headers: this.headersAuth() });
  }
}

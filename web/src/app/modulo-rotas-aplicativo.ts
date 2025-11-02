// Rotas do aplicativo para navegar entre as 4 telas
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginCadastroComponent } from './pages/login-cadastro/login-cadastro.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { ResumoPedidoComponent } from './pages/resumo-pedido/resumo-pedido.component';
import { MobileSimulacaoComponent } from './pages/mobile-simulacao/mobile-simulacao.component';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';

const routes: Routes = [
  // Início agora vai direto ao catálogo de produtos
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'login', component: LoginCadastroComponent, data: { title: 'Login' } },
  { path: 'catalogo', component: CatalogoComponent, data: { title: 'Catálogo de Produtos' } },
  { path: 'carrinho', component: CarrinhoComponent, data: { title: 'Carrinho' } },
  { path: 'resumo/:id', component: ResumoPedidoComponent, data: { title: 'Resumo do Pedido' } },
  { path: 'minha-conta', component: MinhaContaComponent, data: { title: 'Minha Conta' } },
  { path: 'mobile', component: MobileSimulacaoComponent, data: { title: 'App Mobile (Flutter)' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ModuloRotasAplicativo {}

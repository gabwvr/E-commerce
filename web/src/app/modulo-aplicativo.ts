// Módulo principal do Angular
// Importa componentes das telas e serviços
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ModuloRotasAplicativo } from './modulo-rotas-aplicativo';
import { ComponenteAplicativo } from './aplicativo.component';
import { LoginCadastroComponent } from './pages/login-cadastro/login-cadastro.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { ResumoPedidoComponent } from './pages/resumo-pedido/resumo-pedido.component';
import { MobileSimulacaoComponent } from './pages/mobile-simulacao/mobile-simulacao.component';

@NgModule({
  declarations: [
    ComponenteAplicativo,
    LoginCadastroComponent,
    CatalogoComponent,
    CarrinhoComponent,
    ResumoPedidoComponent,
    MobileSimulacaoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModuloRotasAplicativo,
  ],
  providers: [],
  bootstrap: [ComponenteAplicativo]
})
export class ModuloAplicativo {}

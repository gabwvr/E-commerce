// Módulo principal do Angular
// Importa componentes das telas e serviços
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ModuloRotasAplicativo } from './modulo-rotas-aplicativo';
import { ComponenteAplicativo } from './aplicativo.component';
import { LoginCadastroComponent } from './pages/login-cadastro/login-cadastro.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { ResumoPedidoComponent } from './pages/resumo-pedido/resumo-pedido.component';
import { MobileSimulacaoComponent } from './pages/mobile-simulacao/mobile-simulacao.component';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';

// Registra dados de localização para pt-BR (moeda, datas, números)
registerLocaleData(localePt);

@NgModule({
  declarations: [
    ComponenteAplicativo,
    LoginCadastroComponent,
    CatalogoComponent,
    CarrinhoComponent,
    ResumoPedidoComponent,
    MobileSimulacaoComponent,
    MinhaContaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModuloRotasAplicativo,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [ComponenteAplicativo]
})
export class ModuloAplicativo {}

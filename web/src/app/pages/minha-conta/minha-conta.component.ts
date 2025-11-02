// Página Minha Conta: exibe ações do usuário e permite sair
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicoApi } from '../../services/servico-api.service';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.css']
})
export class MinhaContaComponent {
  constructor(private api: ServicoApi, private router: Router) {}

  sair() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}


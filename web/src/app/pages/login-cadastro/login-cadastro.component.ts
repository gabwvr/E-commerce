// Tela 1: Login e Cadastro de Usuário
// Formulários simples com integração na API
import { Component } from '@angular/core';
// Usaremos formulários simples com ngModel para evitar complexidade
import { Router } from '@angular/router';
import { ServicoApi } from '../../services/servico-api.service';

@Component({
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.css']
})
export class LoginCadastroComponent {
  // Controle de abas: login x cadastro
  aba: 'login' | 'cadastro' = 'login';

  // Modelos simples para ngModel
  login = { email: '', senha: '' };
  cadastro = {
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: '',
    endereco: {
      rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
    }
  };

  mensagem: string | null = null;

  constructor(private api: ServicoApi, private router: Router) {}

  // Alterna aba
  irPara(aba: 'login' | 'cadastro') {
    this.aba = aba;
    this.mensagem = null;
  }

  // Faz login e guarda token no serviço
  fazerLogin() {
    if (!this.login.email || !this.login.senha) { this.mensagem = 'Preencha e-mail e senha'; return; }
    this.api.login(this.login.email, this.login.senha).subscribe({
      next: (res) => {
        this.api.token = res.token; // guarda token para próximas chamadas
        this.mensagem = 'Login realizado com sucesso!';
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        this.mensagem = err?.error?.mensagem || 'Erro ao fazer login';
      },
    });
  }

  // Faz cadastro e mostra feedback
  fazerCadastro() {
    // Validação bem simples
    const d = this.cadastro;
    if (!d.nome || !d.email || !d.senha || !d.endereco.rua || !d.endereco.numero || !d.endereco.complemento || !d.endereco.bairro || !d.endereco.cidade || !d.endereco.estado || !d.endereco.cep) {
      this.mensagem = 'Preencha todos os campos obrigatórios';
      return;
    }
    this.api.cadastrar(d).subscribe({
      next: () => {
        this.mensagem = 'Cadastro feito! Agora é só logar!';
        this.aba = 'login';
      },
      error: (err) => {
        this.mensagem = err?.error?.mensagem || 'Erro ao cadastrar';
      },
    });
  }

  // ===== Formatação de campos do cadastro =====
  private somenteDigitos(v: string): string { return (v || '').replace(/\D/g, ''); }

  onCpfChange(v: string) {
    const d = this.somenteDigitos(v).slice(0, 11);
    let out = d;
    if (d.length > 9) out = `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
    else if (d.length > 6) out = `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    else if (d.length > 3) out = `${d.slice(0,3)}.${d.slice(3)}`;
    this.cadastro.cpf = out;
  }

  onCepChange(v: string) {
    const d = this.somenteDigitos(v).slice(0, 8);
    let out = d;
    if (d.length > 5) out = `${d.slice(0,5)}-${d.slice(5)}`;
    this.cadastro.endereco.cep = out;
  }

  onTelefoneChange(v: string) {
    const d = this.somenteDigitos(v).slice(0, 11);
    let out = d;
    if (d.length >= 11) {
      out = `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`;
    } else if (d.length >= 10) {
      out = `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6,10)}`;
    } else if (d.length > 2) {
      out = `(${d.slice(0,2)}) ${d.slice(2)}`;
    } else if (d.length > 0) {
      out = `(${d}`;
    }
    this.cadastro.telefone = out;
  }

  onNumeroChange(v: string) {
    const d = this.somenteDigitos(v).slice(0, 6);
    this.cadastro.endereco.numero = d;
  }

  onUfChange(v: string) {
    const out = (v || '').replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
    this.cadastro.endereco.estado = out;
  }
}

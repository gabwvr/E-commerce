// Aplicativo Flutter em português
// Tema claro com laranja e design moderno (cantinhos arredondados)
// Quatro telas: Login/Cadastro, Catálogo, Carrinho, Resumo do Pedido

import 'package:flutter/material.dart';
import 'services/api_service.dart';

void main() {
  runApp(const MeuApp());
}

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFFF7A00), brightness: Brightness.light),
      useMaterial3: true,
      inputDecorationTheme: const InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
      ),
      cardTheme: const CardTheme(
        elevation: 3,
        margin: EdgeInsets.symmetric(vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(14))),
      ),
    );

    return MaterialApp(
      title: 'Ecommerce Online',
      theme: tema,
      initialRoute: '/',
      routes: {
        '/': (context) => const TelaLoginCadastro(),
        '/catalogo': (context) => const TelaCatalogo(),
        '/carrinho': (context) => const TelaCarrinho(),
        '/resumo': (context) => const TelaResumoPedido(),
      },
    );
  }
}

final api = ApiService(); // serviço compartilhado simples

// Tela 1: Login e Cadastro
class TelaLoginCadastro extends StatefulWidget {
  const TelaLoginCadastro({super.key});
  @override
  State<TelaLoginCadastro> createState() => _TelaLoginCadastroState();
}

class _TelaLoginCadastroState extends State<TelaLoginCadastro> {
  String aba = 'login'; // controle de aba
  final _formLogin = GlobalKey<FormState>();
  final _formCadastro = GlobalKey<FormState>();

  final emailLoginCtrl = TextEditingController();
  final senhaLoginCtrl = TextEditingController();

  final nomeCtrl = TextEditingController();
  final emailCadCtrl = TextEditingController();
  final senhaCadCtrl = TextEditingController();
  final telefoneCtrl = TextEditingController();
  final ruaCtrl = TextEditingController();
  final numeroCtrl = TextEditingController();
  final complementoCtrl = TextEditingController();
  final bairroCtrl = TextEditingController();
  final cidadeCtrl = TextEditingController();
  final estadoCtrl = TextEditingController();
  final cepCtrl = TextEditingController();

  String? mensagem;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ecommerce Online')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              FilledButton(
                onPressed: () => setState(() { aba = 'login'; mensagem = null; }),
                child: const Text('Login'),
              ),
              const SizedBox(width: 8),
              FilledButton.tonal(
                onPressed: () => setState(() { aba = 'cadastro'; mensagem = null; }),
                child: const Text('Cadastro'),
              ),
            ]),
            const SizedBox(height: 12),
            if (mensagem != null) Text(mensagem!, style: const TextStyle(color: Colors.deepOrange)),

            if (aba == 'login') _buildLogin(context) else _buildCadastro(context),
            const SizedBox(height: 10),
            TextButton(onPressed: () => Navigator.pushNamed(context, '/catalogo'), child: const Text('Ir para catálogo')),
          ],
        ),
      ),
    );
  }

  Widget _buildLogin(BuildContext context) {
    return Form(
      key: _formLogin,
      child: Column(children: [
        TextFormField(controller: emailLoginCtrl, decoration: const InputDecoration(labelText: 'E-mail'), validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: senhaLoginCtrl, decoration: const InputDecoration(labelText: 'Senha'), obscureText: true, validator: _obrigatorio),
        const SizedBox(height: 8),
        FilledButton(onPressed: () async {
          if (!(_formLogin.currentState?.validate() ?? false)) return;
          try {
            final res = await api.login(emailLoginCtrl.text, senhaLoginCtrl.text);
            if (res['token'] != null) {
              setState(() => mensagem = 'Login realizado!');
              // vai pro catálogo
              // ignore: use_build_context_synchronously
              Navigator.pushReplacementNamed(context, '/catalogo');
            } else {
              setState(() => mensagem = res['mensagem'] ?? 'Erro ao logar');
            }
          } catch (_) {
            setState(() => mensagem = 'Erro ao logar');
          }
        }, child: const Text('Entrar')),
      ]),
    );
  }

  Widget _buildCadastro(BuildContext context) {
    return Form(
      key: _formCadastro,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        TextFormField(controller: nomeCtrl, decoration: const InputDecoration(labelText: 'Nome'), validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: emailCadCtrl, decoration: const InputDecoration(labelText: 'E-mail'), validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: senhaCadCtrl, decoration: const InputDecoration(labelText: 'Senha'), obscureText: true, validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: telefoneCtrl, decoration: const InputDecoration(labelText: 'Telefone')),

        const SizedBox(height: 12),
        const Text('Endereço', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextFormField(controller: ruaCtrl, decoration: const InputDecoration(labelText: 'Rua'), validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: numeroCtrl, decoration: const InputDecoration(labelText: 'Número'), validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: complementoCtrl, decoration: const InputDecoration(labelText: 'Complemento')),
        const SizedBox(height: 8),
        TextFormField(controller: bairroCtrl, decoration: const InputDecoration(labelText: 'Bairro'), validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: cidadeCtrl, decoration: const InputDecoration(labelText: 'Cidade'), validator: _obrigatorio),
        const SizedBox(height: 8),
        TextFormField(controller: estadoCtrl, decoration: const InputDecoration(labelText: 'Estado (UF)'), validator: _ufValidator),
        const SizedBox(height: 8),
        TextFormField(controller: cepCtrl, decoration: const InputDecoration(labelText: 'CEP'), validator: _obrigatorio),
        const SizedBox(height: 8),
        FilledButton(onPressed: () async {
          if (!(_formCadastro.currentState?.validate() ?? false)) return;
          try {
            final res = await api.cadastrar({
              'nome': nomeCtrl.text,
              'email': emailCadCtrl.text,
              'senha': senhaCadCtrl.text,
              'telefone': telefoneCtrl.text,
              'endereco': {
                'rua': ruaCtrl.text,
                'numero': numeroCtrl.text,
                'complemento': complementoCtrl.text,
                'bairro': bairroCtrl.text,
                'cidade': cidadeCtrl.text,
                'estado': estadoCtrl.text,
                'cep': cepCtrl.text,
              }
            });
            setState(() => mensagem = res['mensagem'] ?? 'Cadastro realizado!');
            setState(() => aba = 'login');
          } catch (_) { setState(() => mensagem = 'Erro ao cadastrar'); }
        }, child: const Text('Cadastrar')),
      ]),
    );
  }

  String? _obrigatorio(String? v) => (v == null || v.trim().isEmpty) ? 'Obrigatório' : null;
  String? _ufValidator(String? v) {
    if (v == null || v.trim().isEmpty) return 'Obrigatório';
    final t = v.trim();
    if (t.length != 2) return 'Informe 2 letras';
    return null;
  }
}

// Tela 2: Catálogo
class TelaCatalogo extends StatefulWidget { const TelaCatalogo({super.key}); @override State<TelaCatalogo> createState() => _TelaCatalogoState(); }
class _TelaCatalogoState extends State<TelaCatalogo> {
  List<dynamic> categorias = [];
  int? categoriaId;
  List<dynamic> produtos = [];
  String? mensagem;

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    try {
      categorias = await api.listarCategorias();
      produtos = await api.listarProdutos(categoriaId: categoriaId);
      setState(() {});
    } catch (_) { setState(() => mensagem = 'Erro ao carregar catálogo'); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Catálogo'), actions: [
        IconButton(onPressed: () => Navigator.pushNamed(context, '/carrinho'), icon: const Icon(Icons.shopping_cart))
      ]),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            const Text('Categoria:'),
            const SizedBox(width: 8),
            DropdownButton<int?> (
              value: categoriaId,
              items: [const DropdownMenuItem(value: null, child: Text('Todas')), ...categorias.map((c) => DropdownMenuItem(value: c['id'] as int, child: Text(c['nome'])))],
              onChanged: (v) async { setState(() => categoriaId = v); await _carregar(); },
            ),
            const Spacer(), if (mensagem != null) Text(mensagem!, style: const TextStyle(color: Colors.deepOrange))
          ]),
          const SizedBox(height: 12),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 0.75, crossAxisSpacing: 8, mainAxisSpacing: 8),
              itemCount: produtos.length,
              itemBuilder: (context, i) {
                final p = produtos[i];
                return Card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Expanded(child: Image.network(p['imagem_url'] ?? '', fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.image)) ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(p['nome'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                      Text('R\$ ${p['preco'] ?? ''}', style: const TextStyle(color: Colors.deepOrange, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      FilledButton(onPressed: () async {
                        try { await api.adicionarCarrinho(p['id'] as int, 1); setState(() => mensagem = 'Adicionado ao carrinho!'); }
                        catch (_) { setState(() => mensagem = 'Erro ao adicionar'); }
                      }, child: const Text('Adicionar ao Carrinho')),
                    ]),
                  )
                ]));
              },
            ),
          )
        ]),
      ),
    );
  }
}

// Tela 3: Carrinho
class TelaCarrinho extends StatefulWidget { const TelaCarrinho({super.key}); @override State<TelaCarrinho> createState() => _TelaCarrinhoState(); }
class _TelaCarrinhoState extends State<TelaCarrinho> {
  List<dynamic> itens = [];
  num total = 0;
  String? mensagem;

  @override
  void initState() { super.initState(); _carregar(); }

  Future<void> _carregar() async {
    try { final res = await api.listarCarrinho(); itens = res['itens']; total = res['total']; setState(() {}); }
    catch (_) { setState(() => mensagem = 'Erro ao carregar carrinho'); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Carrinho')),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (mensagem != null) Text(mensagem!, style: const TextStyle(color: Colors.deepOrange)),
          Expanded(
            child: ListView.builder(
              itemCount: itens.length,
              itemBuilder: (context, i) {
                final item = itens[i];
                return Card(child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(children: [
                    SizedBox(width: 90, height: 70, child: Image.network(item['imagem_url'] ?? '', fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.image))),
                    const SizedBox(width: 10),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(item['nome'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                      Text('Preço: R\$ ${item['preco']} | Subtotal: R\$ ${item['subtotal']}'),
                    ])),
                    const SizedBox(width: 10),
                    SizedBox(
                      width: 100,
                      child: TextFormField(
                        initialValue: '${item['quantidade']}',
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Qtd'),
                        onFieldSubmitted: (v) async {
                          final q = int.tryParse(v) ?? 1;
                          try { await api.atualizarItemCarrinho(item['id'] as int, q); await _carregar(); }
                          catch (_) { setState(() => mensagem = 'Erro ao atualizar'); }
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(onPressed: () async { try { await api.removerItemCarrinho(item['id'] as int); await _carregar(); } catch (_) { setState(() => mensagem = 'Erro ao remover'); } }, icon: const Icon(Icons.delete)),
                  ]),
                ));
              },
            ),
          ),
          Text('Total: R\$ $total', style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          FilledButton(onPressed: () async {
            try { final res = await api.finalizarCompra(); if (res['pedido'] != null) { mensagem = 'Compra finalizada!'; final numero = res['pedido']['numero'] as int; // ignore: use_build_context_synchronously
              Navigator.pushNamed(context, '/resumo', arguments: numero); } setState(() {}); }
            catch (_) { setState(() => mensagem = 'Erro ao finalizar'); }
          }, child: const Text('Finalizar Compra')),
        ]),
      ),
    );
  }
}

// Tela 4: Resumo do Pedido
class TelaResumoPedido extends StatefulWidget { const TelaResumoPedido({super.key}); @override State<TelaResumoPedido> createState() => _TelaResumoPedidoState(); }
class _TelaResumoPedidoState extends State<TelaResumoPedido> {
  Map<String, dynamic>? resumo;
  String? mensagem;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final numero = ModalRoute.of(context)?.settings.arguments as int?;
    if (numero != null) _carregar(numero);
  }

  Future<void> _carregar(int id) async {
    try { final res = await api.obterPedido(id); setState(() => resumo = res); }
    catch (_) { setState(() => mensagem = 'Erro ao carregar resumo'); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Resumo do Pedido')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: resumo == null ? const Center(child: CircularProgressIndicator()) : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (mensagem != null) Text(mensagem!, style: const TextStyle(color: Colors.deepOrange)),
          Text('Pedido Nº ${resumo!['numero']}', style: const TextStyle(fontWeight: FontWeight.bold)),
          Text('Total: R\$ ${resumo!['total']}'),
          Text('Data: ${resumo!['criado_em']}'),
          const SizedBox(height: 12),
          const Text('Entrega', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          if (resumo!['endereco'] != null) ...[
            Text('${resumo!['endereco']['rua']}, ${resumo!['endereco']['numero']} - ${resumo!['endereco']['bairro']}'),
            Text('${resumo!['endereco']['cidade']} / ${resumo!['endereco']['estado']} - CEP ${resumo!['endereco']['cep']}'),
          ] else const [Text('Sem endereço selecionado.')],
          const SizedBox(height: 12),
          const Text('Itens', style: TextStyle(fontWeight: FontWeight.bold)),
          Expanded(
            child: ListView.builder(
              itemCount: (resumo!['itens'] as List).length,
              itemBuilder: (context, i) {
                final item = (resumo!['itens'] as List)[i];
                return Card(child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(item['nome'], style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text('Preço: R\$ ${item['preco']} | Qtd: ${item['quantidade']} | Subtotal: R\$ ${item['subtotal']}'),
                  ]),
                ));
              },
            ),
          )
        ]),
      ),
    );
  }
}


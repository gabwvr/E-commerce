// Serviço de API para Flutter
// Guarda token em memória e chama a API REST
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String apiUrl = 'http://localhost:3000/api';
  String? token;

  Map<String, String> _headers() {
    final h = {'Content-Type': 'application/json'};
    if (token != null) h['Authorization'] = 'Bearer $token';
    return h;
  }

  Future<Map<String, dynamic>> cadastrar(Map<String, dynamic> dados) async {
    final resp = await http.post(Uri.parse('$apiUrl/auth/cadastrar'), headers: _headers(), body: jsonEncode(dados));
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> login(String email, String senha) async {
    final resp = await http.post(Uri.parse('$apiUrl/auth/login'), headers: _headers(), body: jsonEncode({'email': email, 'senha': senha}));
    final data = jsonDecode(resp.body);
    if (resp.statusCode == 200) token = data['token'];
    return data;
  }

  Future<List<dynamic>> listarCategorias() async {
    final resp = await http.get(Uri.parse('$apiUrl/categorias'), headers: _headers());
    return jsonDecode(resp.body);
  }

  Future<List<dynamic>> listarProdutos({int? categoriaId}) async {
    final url = categoriaId != null ? '$apiUrl/produtos?categoria_id=$categoriaId' : '$apiUrl/produtos';
    final resp = await http.get(Uri.parse(url), headers: _headers());
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> listarCarrinho() async {
    final resp = await http.get(Uri.parse('$apiUrl/carrinho'), headers: _headers());
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> adicionarCarrinho(int produtoId, int quantidade) async {
    final resp = await http.post(Uri.parse('$apiUrl/carrinho/adicionar'), headers: _headers(), body: jsonEncode({'produto_id': produtoId, 'quantidade': quantidade}));
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> atualizarItemCarrinho(int id, int quantidade) async {
    final resp = await http.put(Uri.parse('$apiUrl/carrinho/item/$id'), headers: _headers(), body: jsonEncode({'quantidade': quantidade}));
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> removerItemCarrinho(int id) async {
    final resp = await http.delete(Uri.parse('$apiUrl/carrinho/item/$id'), headers: _headers());
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> finalizarCompra({int? enderecoId}) async {
    final resp = await http.post(Uri.parse('$apiUrl/pedidos/finalizar'), headers: _headers(), body: jsonEncode({'endereco_id': enderecoId}));
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> obterPedido(int id) async {
    final resp = await http.get(Uri.parse('$apiUrl/pedidos/$id'), headers: _headers());
    return jsonDecode(resp.body);
  }
}

import 'package:http/http.dart' as http;

abstract class KaraRepository {
  Future heyKara(Map<String, String> data, http.Client client);
}

import 'package:http/http.dart' as http;

abstract class ClientRepository {
  Future newToken(Map<String, String> data, http.Client client);
}

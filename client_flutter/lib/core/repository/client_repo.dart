import 'dart:convert';
import 'package:kar_assistant/core/repository/client_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';

class ClientRepo implements ClientRepository {
  @override
  Future newToken(Map<String, String> data) async {
    try {
      final response =
          await HttpRepo().getRequestParams("api/client/newToken", data);
      return json.decode(response.body);
    } catch (err) {
      rethrow;
    }
  }
}

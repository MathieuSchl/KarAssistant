import 'dart:convert';

import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:http/http.dart' as http;
import 'package:kar_assistant/core/repository/kara_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';

class KaraRepo implements KaraRepository {
  @override
  Future<KaraResponse> heyKara(
      Map<String, String?> data, http.Client client,) async {
    try {
      final response =
          await HttpRepo().getRequestParams("api/heyKara", data, client);
      final parsedResponse = KaraResponse.fromJson(json.decode(response.body));
      return parsedResponse;
    } catch (err) {
      rethrow;
    }
  }
}

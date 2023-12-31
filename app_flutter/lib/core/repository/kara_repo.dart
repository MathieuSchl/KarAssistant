import 'dart:convert';

import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/repository/kara_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';

class KaraRepo implements KaraRepository {
  @override
  Future<KaraResponse> heyKara(Map<String, String?> data) async {
    try {
      final response = await HttpRepo().getRequestParams("api/heyKara", data);
      final parsedResponse = KaraResponse.fromJson(json.decode(response.body));
      return parsedResponse;
    } catch (err) {
      rethrow;
    }
  }
}

import 'dart:convert';

import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/repository/kara_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';
import 'package:kar_assistant/services/utils_controller.dart';

class KaraRepo implements KaraRepository {
  @override
  Future<KaraResponse> heyKara(
    Map<String, String> jsonData,
  ) async {
    try {
      Map<String, dynamic> data = await UtilsController().encryptApi(jsonData);

      final response = await HttpRepo().getRequestParams("api/heyKara", data);
      var parsedResponse = jsonDecode(response.body);

      Map<String, dynamic> value =
          await UtilsController().decryptApi(parsedResponse);
      KaraResponse karaResponse = KaraResponse.fromJson(value);
      return karaResponse;
    } catch (err) {
      rethrow;
    }
  }

  // @override
  // Future getHistory(
  //   Map<String, String> data,
  // ) {
  //   print(data);
  //   return object =
  // }
}

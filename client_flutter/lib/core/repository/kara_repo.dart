import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/repository/kara_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';

class KaraRepo implements KaraRepository {
  @override
  Future<KaraResponse> heyKara(
    Map<String, String> jsonData,
  ) async {
    try {
      Map<String, dynamic> value =
          await HttpRepo().getRequestParamsSecure("api/heyKara", jsonData);
      KaraResponse karaResponse = KaraResponse.fromJson(value);
      return karaResponse;
    } catch (err) {
      rethrow;
    }
  }
}

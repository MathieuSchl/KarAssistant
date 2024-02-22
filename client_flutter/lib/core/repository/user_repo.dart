import 'package:kar_assistant/core/repository/user_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';

class UserRepo extends UserRepository {
  @override
  Future<Map<String, dynamic>> getHistory() async {
    try {
      Map<String, dynamic> data = {
        "test": 'bloup',
      }; // empty because juste need DATE and date is filled inside ParamsSecure
      Map<String, dynamic> value =
          await HttpRepo().getRequestParamsSecure("api/user/history", data);
      return value;
    } catch (err) {
      rethrow;
    }
  }
}

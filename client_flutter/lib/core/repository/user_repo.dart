import 'package:kar_assistant/core/repository/user_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';

class UserRepo extends UserRepository {
  @override
  Future<Map<String, dynamic>> getHistory() async {
    try {
      print('get History');
      Map<String, dynamic> data =
          {}; // empty because juste need DATE and date is filled inside ParamsSecure
      Map<String, dynamic> value =
          await HttpRepo().getRequestParamsSecure("api/user/history", data);
      print('value: ${value}');
      return value;
    } catch (err) {
      rethrow;
    }
  }
}

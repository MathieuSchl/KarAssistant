import 'package:kar_assistant/core/repository/user_repo.dart';

class UserController {
  Map<String, dynamic>? currentHistory;
  Future<void> initInfoUser() async {
    // await Future.wait([loadHistory()]);
  }

  Future<void> loadHistory() async {
    Map<String, dynamic> result = await UserRepo().getHistory();
    currentHistory = result;
  }
}

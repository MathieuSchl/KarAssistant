import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:kar_assistant/core/globals.dart' as globals;

class UtilsController {
  Future<void> initEnv() async {
    await dotenv.load(fileName: ".env");
    globals.envBaseUrl = dotenv.env['BASEURL'].toString();
    globals.envMode = dotenv.env['MODE'].toString();
  }
}

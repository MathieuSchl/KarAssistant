import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:kar_assistant/core/globals.dart' as globals;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:kar_assistant/core/repository/client_repo.dart';

class UtilsController {
  AndroidOptions secureOptions() => const AndroidOptions(
        encryptedSharedPreferences: true,
      );

  final FlutterSecureStorage storage = const FlutterSecureStorage();

  Future<void> initEnv() async {
    await dotenv.load(fileName: ".env");
    globals.envBaseUrl = dotenv.env['BASEURL'].toString();
    globals.envMode = dotenv.env['MODE'].toString();
  }

  Future<String> readStorage(String key) async {
    String value;
    value = await storage.read(key: key) ?? '';
    return value;
  }

  Future<void> setStorage(String key, String value) async {
    await storage.write(key: key, value: value);
  }

  Future<void> deleteStorage(String key) async {
    await storage.delete(key: key);
  }

  Future<void> setupLoginToken() async {
    if (await readStorage('clientToken') != '') {
      Map<String, String> data = {
        "appType": 'mobile_app',
        'rsaPublicKey': 'publicKey',
      };
      var result = await ClientRepo().newToken(data, http.Client());
      await setStorage('privateKey', 'privateKey');
      await setStorage('clientToken', result['clientToken']);
      await setStorage('publicKey', result['publicKey']);
    }
    globals.clientToken = await readStorage('clientToken');
  }
}

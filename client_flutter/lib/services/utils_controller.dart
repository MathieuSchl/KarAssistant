import 'package:encrypt/encrypt.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:kar_assistant/core/globals.dart' as globals;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:kar_assistant/core/repository/client_repo.dart';
import 'package:pointycastle/export.dart';

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
      };
      var result = await ClientRepo().newToken(data, http.Client());
      await setStorage('clientPrivateKey', result['clientPrivateKey']);
      await setStorage('clientToken', result['clientToken']);
      await setStorage('backPublicKey', result['backPublicKey']);
    }
    globals.clientToken = await readStorage('clientToken');
  }

  Future<Encrypted> encryptRSA(String keyToEncrypt) async {
    final stringPublicKey =
        await UtilsController().readStorage('backPublicKey');
    RSAPublicKey publicKey =
        RSAKeyParser().parse(stringPublicKey) as RSAPublicKey;
    final encrypterRsa = Encrypter(
      RSA(
        publicKey: publicKey,
        encoding: RSAEncoding.OAEP,
      ),
    );
    Encrypted encrypted = encrypterRsa.encrypt(
      keyToEncrypt,
    );
    return encrypted;
  }

  Future<String> decryptRSA(Encrypted keyToDecrypt) async {
    final stringPrivateKey =
        await UtilsController().readStorage('clientPrivateKey');
    RSAPrivateKey privateKey =
        RSAKeyParser().parse(stringPrivateKey) as RSAPrivateKey;
    final decrypter = Encrypter(
      RSA(
        privateKey: privateKey,
        encoding: RSAEncoding.OAEP,
      ),
    );
    String decrypted = decrypter.decrypt(keyToDecrypt);
    return decrypted;
  }

  Encrypted encryptAES(String plainText, Key key, IV iv) {
    final encrypter = Encrypter(AES(key, mode: AESMode.cbc));
    Encrypted encrypted = encrypter.encrypt(plainText, iv: iv);
    return encrypted;
  }

  String decryptAES(Encrypted encrypted, Key key, IV iv) {
    final encrypter = Encrypter(AES(key, mode: AESMode.cbc));
    String decrypted = encrypter.decrypt(encrypted, iv: iv);
    return decrypted;
  }
}

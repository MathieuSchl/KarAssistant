import 'dart:convert';
import 'dart:developer';

import 'package:encrypt/encrypt.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:kar_assistant/core/globals.dart' as globals;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:kar_assistant/core/repository/client_repo.dart';
import 'package:convert/convert.dart';
import 'package:pointycastle/export.dart';

class UtilsController {
  AndroidOptions secureOptions() => const AndroidOptions(
        encryptedSharedPreferences: true,
      );

  final FlutterSecureStorage storage = const FlutterSecureStorage();
  Future<void> init() async {
    await Future.wait([initEnv()]);
  }

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

  Future<void> verifTokenExistStorage() async {
    String clientToken = await readStorage('clientToken');
    if (clientToken == '') {
      clientToken = await setupToken();
    }
    print('Client token ${clientToken}');
    globals.clientToken = clientToken;
  }

  Future<String> setupToken() async {
    Map<String, String> data = {
      "appType": 'mobile_app',
    };
    var result = await ClientRepo().newToken(data);
    await setStorage('clientPrivateKey', result['clientPrivateKey']);
    await setStorage('clientToken', result['clientToken']);
    await setStorage('backPublicKey', result['backPublicKey']);
    String clientToken = result['clientToken'];
    return clientToken;
  }

  Future<void> removeToken() async {
    await deleteStorage('clientPrivateKey');
    await deleteStorage('clientToken');
    await deleteStorage('backPublicKey');
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

  Future<Map<String, dynamic>> encryptApi(jsonData) async {
    //encrypted
    jsonData['date'] = DateTime.now().toUtc().toIso8601String();

    String dataString = jsonEncode(jsonData);
    final key = Key.fromSecureRandom(16);
    final iv = IV.fromSecureRandom(16);
    Encrypted dataEncrypted = UtilsController().encryptAES(dataString, key, iv);
    String dataAes = '{"key":"${key.base64}","iv":"${iv.base64}"}';
    Encrypted dataAesEncrypted = await UtilsController().encryptRSA(dataAes);
    Map<String, dynamic> data = {
      'data': hex.encode(dataEncrypted.bytes),
      'aes': dataAesEncrypted.base64,
    };
    return data;
  }

  Future<Map<String, dynamic>> decryptApi(parsedResponse) async {
    String dataAesDecrypted = await UtilsController()
        .decryptRSA(Encrypted.fromBase64(parsedResponse['aes']));
    var jsonDataAes = jsonDecode(dataAesDecrypted);
    String message = UtilsController().decryptAES(
      Encrypted(hex.decode(parsedResponse['data']) as Uint8List),
      Key.fromBase64(jsonDataAes['key']),
      IV.fromBase64(jsonDataAes['iv']),
    );

    Map<String, dynamic> value = jsonDecode(message);
    // La valeur stockée dans un JSON

    message = message.replaceAllMapped(
      RegExp(r'\\+x([0-9a-fA-F]{2})'),
      (match) => String.fromCharCode(int.parse(match.group(1)!, radix: 16)),
    );
    print(message);
    // Décoder le JSON
    value = json.decode(message);

    return value;
  }
}

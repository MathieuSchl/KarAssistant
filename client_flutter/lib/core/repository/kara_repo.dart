import 'dart:convert';
import 'dart:developer';

import 'package:encrypt/encrypt.dart';
import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:http/http.dart' as http;
import 'package:kar_assistant/core/repository/kara_repository.dart';
import 'package:kar_assistant/services/http_repo.dart';
import 'package:kar_assistant/services/utils_controller.dart';
import 'package:pointycastle/export.dart';

class KaraRepo implements KaraRepository {
  @override
  Future<KaraResponse> heyKara(
    Map<String, String> jsonData,
    http.Client client,
  ) async {
    try {
      //encrypted
      jsonData['date'] = DateTime.now().toUtc().toIso8601String();

      String dataString = jsonEncode(jsonData);

      final key = Key.fromSecureRandom(16);
      final iv = IV.fromSecureRandom(16);
      Encrypted dataEncrypted =
          UtilsController().encryptAES(dataString, key, iv);
      String dataAes = '{"key":"${key.base64}","iv":"${iv.base64}"}';
      Encrypted dataAesEncrypted = await UtilsController().encryptRSA(dataAes);
      Map<String, dynamic> data = {
        'data': dataEncrypted.base64,
        'aes': dataAesEncrypted.base64,
      };
      String dataAesDecrypted =
          await UtilsController().decryptRSA(Encrypted.from64(data['aes']));
      print(dataAesDecrypted);
      var jsonDataAes = jsonDecode(dataAesDecrypted);
      print(jsonDataAes['iv']);
      String message = UtilsController().decryptAES(
        Encrypted.from64(data['data']),
        Key.fromBase64(jsonDataAes['key']),
        IV.fromBase64(jsonDataAes['iv']),
      );
      print('secondData: $message');
      Map<String, String> value = jsonDecode(message);
      print(value.toString());

      print(value);
      final response = await HttpRepo().getRequestParams("api/heyKara", data);
      final parsedResponse = KaraResponse.fromJson(jsonDecode(response.body));
      return parsedResponse;
    } catch (err) {
      rethrow;
    }
  }
}

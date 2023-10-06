import 'dart:convert';
import 'dart:developer';
import 'dart:typed_data';
import 'package:convert/convert.dart';

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
        'data': hex.encode(dataEncrypted.bytes),
        'aes': dataAesEncrypted.base64,
      };

      final response = await HttpRepo().getRequestParams("api/heyKara", data);
      var parsedResponse = jsonDecode(response.body);

      String dataAesDecrypted = await UtilsController()
          .decryptRSA(Encrypted.fromBase64(parsedResponse['aes']));
      var jsonDataAes = jsonDecode(dataAesDecrypted);
      String message = UtilsController().decryptAES(
        Encrypted(hex.decode(parsedResponse['data']) as Uint8List),
        Key.fromBase64(jsonDataAes['key']),
        IV.fromBase64(jsonDataAes['iv']),
      );
      Map<String, dynamic> value = jsonDecode(message);
      KaraResponse karaResponse = KaraResponse.fromJson(value);
      return karaResponse;
    } catch (err) {
      rethrow;
    }
  }
}

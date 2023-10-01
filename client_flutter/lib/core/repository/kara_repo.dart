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
      final stringPublicKey = await UtilsController().readStorage('publicKey');
      RSAKeyParser parser = RSAKeyParser();
      RSAPublicKey publicKey = parser.parse(stringPublicKey) as RSAPublicKey;
      final encrypter = Encrypter(
        RSA(
          publicKey: publicKey,
          encoding: RSAEncoding.OAEP,
        ),
      );

      //encrypted
      jsonData['date'] = DateTime.now().toUtc().toIso8601String();
      var dataString = jsonEncode(jsonData);

      final Encrypted encrypted = encrypter.encrypt(dataString);
      Map<String, dynamic> data = {'data': encrypted.base64};
      //request
      final response = await HttpRepo().getRequestParams("api/heyKara", data);
      RSAPrivateKey privateKey = parser.parse(stringPublicKey) as RSAPrivateKey;
      final decrypter = Encrypter(
        RSA(
          privateKey: privateKey,
          encoding: RSAEncoding.OAEP,
        ),
      );
      //decrypted

      String value = decrypter.decrypt64(response.body);

      final parsedResponse = KaraResponse.fromJson(json.decode(value));
      return parsedResponse;
    } catch (err) {
      rethrow;
    }
  }
}

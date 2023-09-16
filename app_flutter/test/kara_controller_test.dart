import 'dart:convert';

import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/services/utils_controller.dart';
import 'package:test/test.dart';
import 'package:kar_assistant/screens/home_page/controller/kara_controller.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'kara_controller_test.mocks.dart';

@GenerateNiceMocks([MockSpec<KaraController>(),MockSpec<KaraResponse>()])
void main() {
  UtilsController().initEnv();
  group('verifIsToken', () {
    test('value should start at null', () {
      expect(KaraController().karaLastResponse, isNull);
    });

    // test('value should be loaded', () async {
    //   MockKaraController controller = MockKaraController();

    //   KaraResponse response= KaraResponse.fromJson(json.decode("""{
    //   "similarity": 0.212,
    //   "bestPhrase": "Bonjour",
    //   "shortAnswerExpected": false,
    //   "clientExist": false,
    //   "lang": "fr",
    //   "skill": "kara/greetings",
    //   "result": "Bonjour je suis Kara",
    //   "convToken": "Token"
    //   }"""));

    //   when(controller.askedKara('bonjour')).thenAnswer((_) async => response);

    //   expect(await controller.askedKara('bonjour'), response);

    //   expect(controller.karaLastResponse, isNotNull);
    //   expect(controller.karaLastResponse, isA<KaraResponse>);
    // });

    test('token Should be in value', () {
      KaraController controller = KaraController();
      controller.mockAskedKara();
      expect(controller.verifIsToken(), isTrue);
    });
  });
}
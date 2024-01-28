import 'package:http/http.dart' as http;
import 'package:flutter_test/flutter_test.dart';
import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/repository/kara_repo.dart';
import 'package:kar_assistant/services/http_repo.dart';
import 'package:kar_assistant/services/utils_controller.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:kar_assistant/core/globals.dart' as globals;

import 'kara_repo_test.mocks.dart';

@GenerateMocks([http.Client])
void main() async {
  late MockClient client;
  late HttpRepo httpRepo;
  setUpAll(() {
    client = MockClient();
    globals.clientTest = client;
    globals.clientToken = 'ezaezaeazeazezeaze';
    httpRepo = HttpRepo();
  });
  await UtilsController().initEnv();
  group('heyKara', () {
    test('return a KaraResponse', () async {
      Map<String, String> data = {
        'query': 'Bonjour',
        'convToken': '',
        'clientToken': '',
        'timeZone': 'Europe/Paris',
      };
      Map<String, dynamic> parameters =
          await UtilsController().encryptApi(data);
      when(
        client.get(
          httpRepo.getUri("api/heyKara", parameters: parameters),
          headers: httpRepo.header,
        ),
      ).thenAnswer(
        (_) async => http.Response(
          '''{
          "similarity": 0.212,
          "bestPhrase": "Bonjour",
          "shortAnswerExpected": false,
          "clientExist": false,
          "lang": "fr",
          "skill": "kara/greetings",
          "result": "Bonjour je suis Kara",
          "convToken": "Token"
        }''',
          200,
        ),
      );

      expect(await KaraRepo().heyKara(data), isA<KaraResponse>());
    });

    test('throws an http exception', () {
      // Use Mockito to return a successful response when it calls the
      // provided http.Client.
      Map<String, String> data = {
        'query': 'Bonjour',
        'convToken': '',
        'clientToken': '',
        'timeZone': 'Europe/Paris',
      };

      when(
        client.get(
          httpRepo.getUri("api/heyKara", parameters: data),
          headers: httpRepo.header,
        ),
      ).thenAnswer((_) async => http.Response('Not Found', 404));

      expect(KaraRepo().heyKara(data), throwsException);
    });
  });
}

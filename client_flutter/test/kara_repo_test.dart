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
void main() {
  late MockClient client;
  late HttpRepo httpRepo;
  late KaraRepo karaRepo;
  setUpAll(() {
    client = MockClient();
    globals.clientTest = client;
    httpRepo = HttpRepo();
    karaRepo = KaraRepo();
  });
  UtilsController().initEnv();
  group('heyKara', () {
    test('return a KaraResponse', () async {
      // Use Mockito to return a successful response when it calls the
      // provided http.Client.
      Map<String, String> data = {
        'query': 'Bonjour',
        'convToken': '',
        'clientToken': '',
        'timeZone': 'Europe/Paris',
      };
      when(client.get(httpRepo.getUri("api/heyKara", parameters: data),
              headers: httpRepo.header,),)
          .thenAnswer(
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

      expect(await karaRepo.heyKara(data, client), isA<KaraResponse>());
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

      // Use Mockito to return an unsuccessful response when it calls the
      // provided http.Client.
      when(client.get(httpRepo.getUri("api/heyKara", parameters: data),
              headers: httpRepo.header,),)
          .thenAnswer((_) async => http.Response('Not Found', 404));

      expect(karaRepo.heyKara(data, client), throwsException);
    });
  });
}

import 'package:test/test.dart';
import 'package:kar_assistant/screens/home_page/controller/kara_controller.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/annotations.dart';

@GenerateMocks([http.Client])
void main() {
  group('verifIsToken', () {
    test('value should start at null', () {
      expect(KaraController().karaLastResponse, isNull);
    });

    test('value should be loaded', () {
      KaraController controller = KaraController();
      controller.mockAskedKara();
      // you have to configure mockito to create this test
      expect(controller.karaLastResponse, isNotNull);
    });

    test('token Should be in value', () {
      KaraController controller = KaraController();
      controller.mockAskedKara();
      expect(controller.verifIsToken(), isTrue);
    });
  });
}
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class MySecureStorage {
  AndroidOptions secureOptions() => const AndroidOptions(
        encryptedSharedPreferences: true,
      );

  final FlutterSecureStorage storage = const FlutterSecureStorage();

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
}

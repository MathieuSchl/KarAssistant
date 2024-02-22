import 'package:http/http.dart' as http;

abstract class HttpRepository {
  Future<http.Response> getRequest(String url);

  // Future<Response> getBytesRequestParams(String url, Map<String, dynamic> data);

  Future<http.Response> getRequestParams(String url, Map<String, dynamic> data);

  Future<Map<String, dynamic>> getRequestParamsSecure(
    String url,
    Map<String, dynamic> data,
  );

  Future<http.Response> postRequest(String url, Map<String, dynamic> data);
}

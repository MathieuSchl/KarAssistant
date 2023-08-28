import 'dart:async';
import 'dart:convert';
import 'package:kar_assistant/core/globals.dart' as globals;
import 'package:http/http.dart' as http;
import 'package:kar_assistant/services/http_repository.dart';

class HttpRepo implements HttpRepository {
  int timeOutSeconds = 20;
  String responseTimeOut = jsonEncode({'type': 'error', 'status': 408, 'message': 'Le serveur a mis trop de temps à répondre'});
  String responseOtherError = jsonEncode({'type': 'error', 'status': 404, 'message': 'Le serveur semble ne pas être accessible'});
  Map<String, String>? header;
  String baseUrl = globals.envBaseUrl!;
  HttpRepo() {
    if (globals.tokenApi != null) {
      header = {'Content-Type': 'application/json; charset=UTF-8', 'Accept': 'application/json', 'Authorization': 'Bearer ${globals.tokenApi}'};
    } else {
      header = {
        'Accept': 'application/json',
      };
    }
  }

  Uri getUri(String url, {Map<String, dynamic>? parameters}) {
    String base = baseUrl.replaceAll("http://", "");
    base = base.replaceAll("https://", "");
    List<String> listUrl = [];
    listUrl = base.split("/");
    base = listUrl[0];
    listUrl.removeAt(0);
    String chemin = "";
    if (listUrl.isEmpty) {
      chemin = url;
    } else {
      chemin = "${listUrl.join("/")}/$url";
    }
    if (baseUrl.contains("http://")) {   
      return Uri.http(base, chemin, parameters);
    } else {
      return Uri.https(base, chemin, parameters);
    }
  }

  @override
  Future<http.Response> getRequest(String url) async {
    http.Response response;
    try {
      response = await http
          .get(getUri(url), headers: header)
          .timeout(
            Duration(seconds: timeOutSeconds),
            onTimeout: () => http.Response(responseTimeOut, 408),
          )
          .onError((error, stackTrace) => http.Response(responseOtherError, 503));

      if (response.statusCode < 200 || response.statusCode > 299) {
        final error = json.decode(response.body);
        throw error['message'];
      }
      return response;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<http.Response> getRequestParams(String url, Map<String, dynamic> parameters) async {
    http.Response response;
    try {
      print(parameters.toString());
      response = await http
          .get(getUri(url, parameters:parameters), headers: header)
          .timeout(
            Duration(seconds: timeOutSeconds),
            onTimeout: () => http.Response(responseTimeOut, 408),
          )
          .onError((error, stackTrace) => http.Response(responseOtherError, 503));

      if (response.statusCode < 200 || response.statusCode > 299) {
        final error = json.decode(response.body);
        throw error['message'];
      }
      return response;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<http.Response> postRequest(String url, Map<String, dynamic> data) async {
    http.Response response;

    try {
      print(Uri.encodeFull(jsonEncode(data)));
      response = await http
        .post(getUri(url), headers: header, body: Uri.encodeFull(jsonEncode(data)))
        .timeout(
          Duration(seconds: timeOutSeconds),
          onTimeout: () => http.Response(responseTimeOut, 408),
        )
        .onError((error, stackTrace) => http.Response(responseOtherError, 503));

      if (response.statusCode < 200 || response.statusCode > 299) {
        final error = json.decode(response.body);
        throw error['message'];
      }
      return response;
    } catch (e) {
      rethrow;
    }
  }
}
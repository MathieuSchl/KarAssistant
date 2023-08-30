import 'package:flutter/foundation.dart';
import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/repository/kara_repo.dart';

class KaraController{

final KaraRepo karaRepo = KaraRepo();
  KaraResponse? karaLastResponse;
  Future<KaraResponse> askedKara(String text, ) async {
    Map<String, String> data = {
      'query': text,
      'token': karaLastResponse !=null ? karaLastResponse!.token ?? '' :'',
      'timeZone':'Europe/Paris'
    };
    KaraResponse result;
    result = await karaRepo.heyKara(data);
    if (kDebugMode) {
      print(result.toJson());
    }
    karaLastResponse=result;
    return result;
  }

  bool verifIsToken(){
    if(karaLastResponse!=null){
      if(karaLastResponse!.token != null){
        return true;
      }
    }
    return false;
  }
  
}
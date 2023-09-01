import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:kar_assistant/core/models/conversation/message_conversation.dart';
import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/repository/kara_repo.dart';

class KaraController{

final KaraRepo karaRepo = KaraRepo();
  KaraResponse? karaLastResponse;
  String lastWords = '';
  List<MessageConversation> listResponse = [];
  final ScrollController scrollControllerHistory = ScrollController();
  
  void scrollDown(ScrollController controller) {
    // controller.animateTo(
    //   controller.position.maxScrollExtent,
    //   duration: const Duration(milliseconds: 500),
    //   curve: Curves.fastOutSlowIn,
    // );
    controller.jumpTo(controller.position.maxScrollExtent);
  }
  
  Future<KaraResponse> askedKara(String text, ) async {
    Map<String, String> data = {
      'query': text,
      'convToken': karaLastResponse !=null ? karaLastResponse!.convToken ?? '' :'',
      'clientToken':'',
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
      if(karaLastResponse!.convToken != null){
        return true;
      }
    }
    return false;
  }
  
}
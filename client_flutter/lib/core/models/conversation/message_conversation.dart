import 'package:json_annotation/json_annotation.dart';

part 'message_conversation.g.dart';

enum TypeConversation {
  kara,
  user,
  recording,
}

@JsonSerializable()
class MessageConversation {
  MessageConversation(
      {required this.type, required this.text, required this.urlImage,});

  @JsonKey(name: "TYPE")
  TypeConversation type;

  @JsonKey(name: "TEXT")
  String text;

  @JsonKey(name: "IMAGESRC")
  String urlImage;

  factory MessageConversation.fromJson(Map<String, dynamic> json) =>
      _$MessageConversationFromJson(json);
  Map<String, dynamic> toJson() => _$MessageConversationToJson(this);
}

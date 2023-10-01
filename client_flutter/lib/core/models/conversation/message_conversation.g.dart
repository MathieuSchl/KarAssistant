// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_conversation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MessageConversation _$MessageConversationFromJson(Map<String, dynamic> json) =>
    MessageConversation(
      type: $enumDecode(_$TypeConversationEnumMap, json['TYPE']),
      text: json['TEXT'] as String,
      urlImage: json['IMAGESRC'] as String,
    );

Map<String, dynamic> _$MessageConversationToJson(
        MessageConversation instance) =>
    <String, dynamic>{
      'TYPE': _$TypeConversationEnumMap[instance.type]!,
      'TEXT': instance.text,
      'IMAGESRC': instance.urlImage,
    };

const _$TypeConversationEnumMap = {
  TypeConversation.kara: 'kara',
  TypeConversation.user: 'user',
  TypeConversation.recording: 'recording',
};

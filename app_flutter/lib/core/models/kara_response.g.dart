// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'kara_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

KaraResponse _$KaraResponseFromJson(Map<String, dynamic> json) => KaraResponse()
  ..result = json['result'] as String
  ..language = json['lang'] as String
  ..skill = json['skill'] as String
  ..similarity = (json['similarity'] as num).toDouble()
  ..bestPhrase = json['bestPhrase'] as String
  ..token = json['token'] as String?;

Map<String, dynamic> _$KaraResponseToJson(KaraResponse instance) =>
    <String, dynamic>{
      'result': instance.result,
      'lang': instance.language,
      'skill': instance.skill,
      'similarity': instance.similarity,
      'bestPhrase': instance.bestPhrase,
      'token': instance.token,
    };

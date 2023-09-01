
import 'package:json_annotation/json_annotation.dart';

part 'kara_response.g.dart';

@JsonSerializable()
class KaraResponse {

  KaraResponse();

  @JsonKey(name:"result")
  late String result;

  @JsonKey(name:"lang")
  late String? language;

  @JsonKey(name:"skill")
  late String? skill;

  @JsonKey(name:"similarity")
  late double similarity;

  @JsonKey(name:"bestPhrase")
  late String bestPhrase;

  @JsonKey(name:"convToken")
  late String? convToken;

  @JsonKey(name:"userToken")
  late String? userToken;


  factory KaraResponse.fromJson(Map<String, dynamic> json) => _$KaraResponseFromJson(json);
  Map<String, dynamic> toJson() => _$KaraResponseToJson(this);
}
import 'dart:async';
import 'dart:io' show Platform;
import 'dart:math';
import 'package:flutter/foundation.dart' show kIsWeb;

import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/widgets/animation_widget/ripple_animation.dart';
import 'package:kar_assistant/screens/home_page/controller/kara_controller.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

class KaraTalking extends StatefulWidget {
  final KaraController karaController ; 
  const KaraTalking(this.karaController, {super.key});

  @override
  _KaraTalkingState createState() => _KaraTalkingState();
}

enum TtsState { playing, stopped }

class _KaraTalkingState extends State<KaraTalking> {

  final SpeechToText _speechToText = SpeechToText();
  bool _speechEnabled = false;
  String _lastWords = '';
  List<String> listResponse = [];
  
  late FlutterTts flutterTts;
  String? language;
  String? engine;
  double volume = 1.0;
  double pitch = 1.0;
  double rate = 0.6;
  bool isCurrentLanguageInstalled = false;
  
  TtsState ttsState = TtsState.stopped;

  get isPlaying => ttsState == TtsState.playing;
  // get isStopped => ttsState == TtsState.stopped;
  // get isPaused => ttsState == TtsState.paused;
  // get isContinued => ttsState == TtsState.continued;

  bool get isIOS => !kIsWeb && Platform.isIOS;
  bool get isAndroid => !kIsWeb && Platform.isAndroid;
  bool get isWindows => !kIsWeb && Platform.isWindows;
  bool get isWeb => kIsWeb;

  @override
  initState() {
    super.initState();
    _initSpeech();
    initTts();
  }

  // ear Section
  void _initSpeech() async {
    _speechEnabled = await _speechToText.initialize();
    setState(() {});
  }

  void _startListening() async {
    await _speechToText.listen(
      onResult: _onSpeechResult,
      localeId: 'FR',
      listenMode: ListenMode.dictation,
    );
    setState(() {});
  }

  void _stopListening() async {
    await _speechToText.stop();
  }

  /// This is the callback that the SpeechToText plugin calls when
  /// the platform returns recognized words.
  void _onSpeechResult(SpeechRecognitionResult result) {
    setState(() {
      _lastWords = result.recognizedWords;
    });
    if(result.finalResult==true){
      widget.karaController.askedKara(result.recognizedWords).then((KaraResponse response){
        setState(() {
          _speak(response.result);
          listResponse.add(response.result);
          if(response.token!= null){
            
          }
        });
      });
    }
  }
  
  //_____________________________________//
  //talk Section
  initTts() {
    flutterTts = FlutterTts();

    _setAwaitOptions();

    if (isAndroid) {
      _getDefaultEngine().then((defaultEngine) {
        flutterTts.setEngine(defaultEngine);
      },);

      _getDefaultVoice().then((defaultLanguage) {
        flutterTts.setVoice(defaultLanguage);
      },);
    }

    flutterTts.setStartHandler(() {
      setState(() {
        print("Playing");
        ttsState = TtsState.playing;
      });
    });

    if (isAndroid) {
      flutterTts.setInitHandler(() {
        setState(() {
          print("TTS Initialized");
        });
      });
    }

    flutterTts.setCompletionHandler(() {
      setState(() {
        print("Complete");
        ttsState = TtsState.stopped;
        if(widget.karaController.verifIsToken()){
          _startListening();
        }
      });
    });

    flutterTts.setErrorHandler((msg) {
      setState(() {
        print("error: $msg");
        ttsState = TtsState.stopped;
      });
    });
  }

  Future _getDefaultEngine() async {
    var engine = await flutterTts.getDefaultEngine;
    if (engine != null) {
      return engine;
    }
  }

  Future<dynamic> _getDefaultVoice() async {
    Map<String, String>? voice = await flutterTts.getDefaultVoice;
    if (voice != null){
      return voice;
    }
  }

  Future _speak(String? textToSpeak) async {
    await flutterTts.setVolume(volume);
    await flutterTts.setSpeechRate(rate);
    await flutterTts.setPitch(pitch);

    if (textToSpeak != null) {
      if (textToSpeak.isNotEmpty) {
        await flutterTts.speak(textToSpeak);
      }
    }
  }

  Future _setAwaitOptions() async {
    await flutterTts.awaitSpeakCompletion(true);
  }

  @override
  void dispose() {
    super.dispose();
    flutterTts.stop();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        //RipplesAnimation
        IconButton(
          color: Colors.red,
          icon: Icon(
            _speechToText.isListening
            ? MdiIcons.microphoneSettings
            : MdiIcons.microphone,
            size: 50,
          ), 
          onPressed: () {
            if(_speechToText.isListening){
              _stopListening();
            }else {
              _startListening();
            }
            setState(() {
            });
          },
        ),
        Container(
          padding: const EdgeInsets.all(16),
          child: Text(
            _speechToText.isListening
              ? _lastWords
              : _speechEnabled
                  ? _lastWords.isEmpty 
                    ? 'Tap the microphone to start listening...'
                    : _lastWords
                  : 'Speech not available',
          ),
        ),
        ListView.builder(
          reverse: true,
          shrinkWrap: true,
          itemCount: min(listResponse.length, 3),
          itemBuilder: (context, index) {
            if(listResponse.length >3){
              return Text(listResponse[listResponse.length-(3-index)]);
          }else {
            return Text(listResponse[index]);
          }
          },
        ),
      ],
    );
  }

}
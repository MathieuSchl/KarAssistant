import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kDebugMode, kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:kar_assistant/core/models/conversation/message_conversation.dart';
import 'package:kar_assistant/core/models/kara_response.dart';
import 'package:kar_assistant/core/widgets/animation_widget/ripple_custom_animation.dart';
import 'package:kar_assistant/core/widgets/border/message_bubble.dart';
import 'package:kar_assistant/screens/home_page/controller/kara_controller.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

class KaraTalking extends StatefulWidget {
  final KaraController karaController;
  final int currentIndexPage;
  final Function() updateParents;
  const KaraTalking(this.karaController,
      {required this.updateParents, required this.currentIndexPage, super.key,});

  @override
  _KaraTalkingState createState() => _KaraTalkingState();
}

enum TtsState { playing, stopped }

class _KaraTalkingState extends State<KaraTalking> {
  final SpeechToText _speechToText = SpeechToText();
  bool _speechEnabled = false;
  bool showKaraAnswer = false;
  GlobalKey<RippleCustomAnimationState> animationKey =
      GlobalKey<RippleCustomAnimationState>();
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
    _speechEnabled = await _speechToText.initialize(
        onError: (errorNotification) =>
            animationKey.currentState!.stopAnimate(),
        onStatus: (status) {
          if (status == 'notListening') {
            animationKey.currentState!.stopAnimate();
          }
        },);
    setState(() {});
  }

  void _startListening() async {
    animationKey.currentState!.startAnimate();
    await _speechToText.listen(
        onResult: _onSpeechResult,
        localeId: 'FR',
        listenMode: ListenMode.dictation,
        cancelOnError: true,);
    setState(() {});
  }

  void _stopListening() async {
    widget.karaController.listResponse.removeLast();
    animationKey.currentState!.stopAnimate();
    await _speechToText.stop();
  }

  /// This is the callback that the SpeechToText plugin calls when
  /// the platform returns recognized words.
  void _onSpeechResult(SpeechRecognitionResult result) {
    setState(() {
      widget.karaController.lastWords = result.recognizedWords;
      widget.updateParents();
    });
    if (result.finalResult == true) {
      MessageConversation saidUSer = MessageConversation(
          type: TypeConversation.user,
          text: result.recognizedWords,
          urlImage: '',);
      widget.karaController.listResponse.insertAll(0, [saidUSer]);
      animationKey.currentState!.stopAnimate();
      widget.updateParents();
      widget.karaController
          .askedKara(result.recognizedWords)
          .then((KaraResponse response) {
        setState(() {
          showKaraAnswer = true;
          MessageConversation saidKara = MessageConversation(
              type: TypeConversation.kara, text: response.result, urlImage: '',);
          widget.karaController.listResponse.insertAll(0, [saidKara]);
          widget.updateParents();

          _speak(response.result).then((value) => {
                Future.delayed(
                  const Duration(seconds: 4),
                  () {
                    if (mounted) {
                      setState(() {
                        showKaraAnswer = false;
                      });
                    }
                  },
                ),
              },);
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
      _getDefaultEngine().then(
        (defaultEngine) {
          flutterTts.setEngine(defaultEngine);
        },
      );

      _getDefaultVoice().then(
        (defaultLanguage) {
          flutterTts.setVoice(defaultLanguage);
        },
      );
    }

    flutterTts.setStartHandler(() {
      setState(() {
        if (kDebugMode) {}
        ttsState = TtsState.playing;
      });
    });

    if (isAndroid) {
      flutterTts.setInitHandler(() {
        setState(() {});
      });
    }

    flutterTts.setCompletionHandler(() {
      setState(() {
        ttsState = TtsState.stopped;
        if (widget.karaController.verifIsToken()) {
          _startListening();
        }
      });
    });

    flutterTts.setErrorHandler((msg) {
      setState(() {
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
    if (voice != null) {
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
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        showKaraAnswer && widget.currentIndexPage != 2
            ? MessageBubble(
                msg: widget.karaController.listResponse[0].text,
              )
            : Container(),
        RippleCustomAnimation(
            key: animationKey,
            ripplesCount: 7,
            size: const Size(100, 100),
            minRadius: 80,
            color: Theme.of(context).colorScheme.primary,
            child: Container(
              decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary,
                  shape: BoxShape.circle,),
              child: InkWell(
                  child: const CircleAvatar(
                    backgroundColor: Colors.white,
                    backgroundImage: AssetImage('image/kara_PP_circle.png'),
                    maxRadius: 55,
                  ),
                  onTapDown: (TapDownDetails details) {
                    if (_speechToText.isListening) {
                      _stopListening();
                    } else {
                      _startListening();
                    }
                    setState(() {});
                  },),
            ),),
        const Padding(padding: EdgeInsets.symmetric(vertical: 16)),
        // Container(
        //   padding: const EdgeInsets.all(16),
        //   child: Text(
        //     _speechToText.isListening
        //       ? _lastWords
        //       : _speechEnabled
        //           ? ''
        //           : 'Impossible de discuter avec kara',
        //   ),
        // ),
      ],
    );
  }
}

import 'dart:math';

import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  final String title = " title"; 
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  final SpeechToText _speechToText = SpeechToText();
  bool _speechEnabled = false;
  String _lastWords = '';
  List<String> listHisto = [];

    @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  /// This has to happen only once per app
  void _initSpeech() async {
    _speechEnabled = await _speechToText.initialize();
    setState(() {});
  }

  /// Each time to start a speech recognition session
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
      listHisto.add(result.recognizedWords);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My name is Kara"),
        backgroundColor: Theme.of(context).colorScheme.primary,
        leading: const Icon(MdiIcons.home) ,),
      body: Center(
        child:Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            IconButton(
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
              itemCount: min(listHisto.length, 3),
              itemBuilder: (context, index) {
                if(listHisto.length >3){
                  return Text(listHisto[listHisto.length-(3-index)]);
              }else {
                return Text(listHisto[index]);
              }
              },
            )
        ],),
      ),
    );
  }
}
import 'dart:async';

import 'package:flame/components.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/components/finger.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/components/play_area.dart';

import 'package:kar_assistant/screens/my_games/the_only_one/config.dart';

enum PlayState { welcome, playing, gameOver }

class TheOnlyOne extends FlameGame {
  TheOnlyOne()
      : super(
          camera: CameraComponent.withFixedResolution(
            width: gameWidth,
            height: gameHeight,
          ),
        );
  final List<Color> listColor = [
    Colors.red,
    // Colors.blue.shade300,
    // Colors.blue.shade900,
    // Colors.deepPurple,
    Colors.purple.shade900,
    Colors.orange.shade800,
    Colors.green.shade600,
  ];
  final Map<int, Finger> fingers = {};
  late Sprite fingerSprite;
  double get width => size.x;
  double get height => size.y;
  late PlayState _playState;

  PlayState get playState => _playState;

  set playState(PlayState playState) {
    _playState = playState;
    switch (playState) {
      case PlayState.welcome:
      case PlayState.gameOver:
      case PlayState.playing:
        print('todo');
    }
  }

  @override
  FutureOr<void> onLoad() async {
    final fingerImage = await images.load('finger_print.png');
    fingerSprite = Sprite(fingerImage);
    super.onLoad();

    camera.viewfinder.anchor = Anchor.topLeft;
    world.add(PlayArea(fingerSprite: fingerSprite));
    debugMode = false;
  }

  @override
  Color backgroundColor() => Colors.black;
}

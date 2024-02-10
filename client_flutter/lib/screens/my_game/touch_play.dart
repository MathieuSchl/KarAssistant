import 'dart:async';
import 'dart:math' as math;

import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';

import 'components/components.dart';
import 'package:kar_assistant/config.dart';

enum PlayState { welcome, playing, gameOver }

class TouchPlay extends FlameGame with HasCollisionDetection, TapDetector {
  TouchPlay()
      : super(
          camera: CameraComponent.withFixedResolution(
            width: gameWidth,
            height: gameHeight,
          ),
        );

  final rand = math.Random();
  double get width => size.x;
  double get height => size.y;

  late PlayState _playState;
  final ValueNotifier<int> score = ValueNotifier(0);
  final ValueNotifier<int> bestScore = ValueNotifier(0);

  PlayState get playState => _playState;

  set playState(PlayState playState) {
    _playState = playState;
    switch (playState) {
      case PlayState.welcome:
      case PlayState.gameOver:
        overlays.add(playState.name);
        world.removeAll(world.children.query<Raquette>());
        if (bestScore.value < score.value) {
          bestScore.value = score.value;
        }
        score.value = 0;
      case PlayState.playing:
        overlays.remove(PlayState.gameOver.name);
        overlays.remove(PlayState.welcome.name);
    }
  }

  @override
  FutureOr<void> onLoad() async {
    super.onLoad();

    camera.viewfinder.anchor = Anchor.topLeft;

    world.add(PlayArea());
    playState = PlayState.welcome;
    score.value = 0;
    bestScore.value = 0;
  }

  void startGame() {
    if (playState == PlayState.playing) return;

    world.removeAll(world.children.query<Finger>());
    world.removeAll(world.children.query<Raquette>());

    playState = PlayState.playing;
    world.add(
      Finger(
        paintFinger: Paint()
          ..color = const Color(0xff1e6091)
          ..style = PaintingStyle.fill,
        radius: fingerRadius,
        position: size / 2,
        velocity: Vector2((rand.nextDouble() - 0.5) * width, height * 0.2)
            .normalized()
          ..scale(height / 4),
      ),
    );
    world.add(
      Raquette(
        // Add from here...
        size: Vector2(batWidth, batHeight),
        cornerRadius: const Radius.circular(fingerRadius / 2),
        position: Vector2(width / 2, height * 0.95),
      ),
    );
    debugMode = false;
  }

  @override
  void onTap() {
    super.onTap();
    startGame();
  }

  @override
  Color backgroundColor() => const Color(0xfff2e8cf);
}

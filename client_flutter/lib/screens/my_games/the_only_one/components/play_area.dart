import 'dart:async';

import 'package:flame/components.dart';
import 'package:flame/collisions.dart';
import 'package:flame/effects.dart';
import 'package:flame/events.dart';
import 'package:flame/extensions.dart';
import 'package:flame/geometry.dart';
import 'package:flutter/material.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/components/finger.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/the_only_one.dart';
import 'package:kar_assistant/screens/my_games/touch_play/touch_play.dart';
import 'dart:math';

class PlayArea extends RectangleComponent
    with TapCallbacks, HasGameReference<TheOnlyOne> {
  PlayArea({required this.fingerSprite})
      : super(
          paint: Paint()..color = const Color(0xfff2e8cf),
        );

  Sprite fingerSprite;
  final _paint = Paint()..color = const Color(0x448BA8FF);

  @override
  void render(Canvas canvas) {
    canvas.drawRect(size.toRect(), _paint);
  }

  @override
  void onTapDown(TapDownEvent event) {
    // game.fingers.map((key,value) { return {key,vlaue}  }.tolist)
    // Color randomColor = .where((Color color) => ()  );
    Finger finger = Finger(
      color: game.listColor.random(),
      position: event.canvasPosition,
      size: Vector2(80, 80),
      spriteFinger: fingerSprite,
      paint: Paint()
        ..color = const Color(0xff1e6091)
        ..style = PaintingStyle.fill,
    );

    final colorEffect = ColorEffect(
      finger.color,
      EffectController(
        alternate: true,
        infinite: true,
        duration: 2,
        reverseDuration: 2,
      ),
      opacityFrom: 0.1,
      opacityTo: 0.9,
    );

    finger.add(colorEffect);

    game.fingers[event.pointerId] = finger;
    game.add(finger);
  }

  @override
  void onLongTapDown(TapDownEvent event) {}

  @override
  void onTapUp(TapUpEvent event) {
    game.remove(game.fingers[event.pointerId]!);
    game.fingers.remove(event.pointerId);
  }

  @override
  void onTapCancel(TapCancelEvent event) {
    print('tapCancel');
  }

  @override
  FutureOr<void> onLoad() async {
    super.onLoad();
    size = Vector2(game.width, game.height);
  }
}

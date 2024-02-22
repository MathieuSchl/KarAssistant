import 'dart:math';
import 'package:flame/components.dart';
import 'package:flame/effects.dart';
import 'package:flame/events.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/the_only_one.dart';
import 'package:flame/game.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/material.dart' hide Draggable;

class Finger extends SpriteComponent
    with DragCallbacks, HasGameReference<TheOnlyOne> {
  Finger({
    required Vector2 position,
    required Vector2 size,
    required this.spriteFinger,
    required this.paint,
    required this.color,
  }) : super(
          sprite: spriteFinger,
          size: size,
          paint: paint,
          // position to the center of the finger
          position: position,
          anchor: Anchor.center,
        );

  Sprite spriteFinger;
  Paint paint;
  Color color;
  bool _isDragged = false;

  final effect = ColorEffect(
    const Color(0xFF00FF00),
    EffectController(duration: 1.5),
    opacityTo: 0.8,
  );

  @override
  void onDragStart(DragStartEvent event) {
    super.onDragStart(event);
    _isDragged = true;

    priority = 10;
  }

  @override
  void onDragUpdate(DragUpdateEvent event) {
    position += event.localDelta;
  }

  @override
  void onDragEnd(DragEndEvent event) {
    super.onDragEnd(event);
    print('dragEnd');
    _isDragged = false;
    removeFromParent();
    game.fingers.removeWhere((key, value) => value == this);
    print(game.fingers);
    priority = 0;
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);
    if (_isDragged) {
    } else {
      paint.color = Colors.blue;
    }
  }
}

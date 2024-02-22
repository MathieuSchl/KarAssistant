import 'package:flame/collisions.dart';
import 'package:flame/components.dart';
import 'package:flame/effects.dart';
import 'package:flutter/material.dart';
import 'package:kar_assistant/screens/my_games/touch_play/components/components.dart';

import '../touch_play.dart';

class Finger extends CircleComponent
    with CollisionCallbacks, HasGameReference<TouchPlay> {
  Finger({
    required this.velocity,
    required super.position,
    required double radius,
    required this.paintFinger,
  }) : super(
          radius: radius,
          anchor: Anchor.center,
          paint: paintFinger,
          children: [
            CircleHitbox(),
          ],
        );
  final Vector2 velocity;
  Paint paintFinger;

  @override
  void update(double dt) {
    super.update(dt);
    position += velocity * dt;
  }

  @override
  void onCollisionStart(
    Set<Vector2> intersectionPoints,
    PositionComponent other,
  ) {
    super.onCollisionStart(intersectionPoints, other);
    if (other is PlayArea) {
      if (intersectionPoints.first.y <= 0) {
        velocity.y = -velocity.y;
        paintFinger.color = Colors.red;
      } else if (intersectionPoints.first.x <= 0) {
        velocity.x = -velocity.x;
        paintFinger.color = Colors.red;
      } else if (intersectionPoints.first.x >= game.width) {
        velocity.x = -velocity.x;
        paintFinger.color = Colors.red;
      } else if (intersectionPoints.first.y >= game.height) {
        add(
          RemoveEffect(
            delay: 0.45,
            onComplete: () {
              // Modify from here
              game.playState = PlayState.gameOver;
            },
          ),
        );
      }
    } else if (other is Raquette) {
      game.score.value++;
      add(
        GlowEffect(
          2.0,
          EffectController(duration: 0.6, reverseDuration: 0.6),
          style: BlurStyle.normal,
        ),
      );
      velocity.y = -velocity.y;
      velocity.x = velocity.x +
          (position.x - other.position.x) / other.size.x * game.width * 0.3;
      paintFinger.color = Colors.green;
    } else {
      debugPrint('collision with $other');
    }
  }
}

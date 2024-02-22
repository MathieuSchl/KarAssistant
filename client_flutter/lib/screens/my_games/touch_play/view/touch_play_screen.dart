import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:kar_assistant/screens/my_games/touch_play/touch_play.dart';
import 'package:kar_assistant/screens/my_games/touch_play/config.dart';
import 'overlay_screen.dart';
import 'score_card.dart';

class TouchPlayScreen extends StatefulWidget {
  const TouchPlayScreen({super.key});

  @override
  State<TouchPlayScreen> createState() => _MyGameScreenState();
}

class _MyGameScreenState extends State<TouchPlayScreen> {
  late final TouchPlay game;

  @override
  void initState() {
    super.initState();
    game = TouchPlay();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Theme(
        data: ThemeData(
          textTheme: GoogleFonts.pressStart2pTextTheme().apply(
            bodyColor: const Color(0xff184e77),
            displayColor: const Color(0xff184e77),
          ),
        ),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xffa9d6e5),
                Color(0xfff2e8cf),
              ],
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Center(
                child: Column(
                  children: [
                    ScoreCard(
                      score: game.score,
                      bestScore: game.bestScore,
                    ),
                    Expanded(
                      child: FittedBox(
                        child: SizedBox(
                          width: gameWidth,
                          height: gameHeight,
                          child: GameWidget(
                            game: game,
                            overlayBuilderMap: {
                              PlayState.welcome.name: (context, game) =>
                                  const OverlayScreen(
                                    title: 'PLAY',
                                    subtitle: 'Touch to start',
                                  ),
                              PlayState.gameOver.name: (context, game) =>
                                  const OverlayScreen(
                                    title: 'GAME OVER',
                                    subtitle: 'Touch to continue',
                                  ),
                            },
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

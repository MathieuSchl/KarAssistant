import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:kar_assistant/screens/my_games/the_only_one/config.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/the_only_one.dart';
import 'package:flame/flame.dart';
import 'package:flame/sprite.dart';

class TheOnlyOnePlayScreen extends StatefulWidget {
  const TheOnlyOnePlayScreen({super.key});

  @override
  State<TheOnlyOnePlayScreen> createState() => _MyGameScreenState();
}

class _MyGameScreenState extends State<TheOnlyOnePlayScreen> {
  late final TheOnlyOne game;

  @override
  void initState() {
    super.initState();
    game = TheOnlyOne();
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
                Color.fromARGB(255, 55, 120, 67),
                Color.fromARGB(255, 100, 68, 35),
              ],
            ),
          ),
          child: SizedBox(
            width: gameWidth,
            height: gameHeight,
            child: GameWidget(
              game: game,
            ),
          ),
        ),
      ),
    );
  }
}

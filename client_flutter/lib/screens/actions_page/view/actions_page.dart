import 'package:flutter/material.dart';
import 'package:kar_assistant/screens/my_game/view/my_game_screen.dart';

class ActionsPage extends StatefulWidget {
  const ActionsPage({super.key});

  @override
  State<ActionsPage> createState() => _ActionsPageState();
}

class _ActionsPageState extends State<ActionsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const MyGameScreen(),
              ),
            );
          },
          child: const Text('Start Game'),
        ),
      ),
    );
  }
}

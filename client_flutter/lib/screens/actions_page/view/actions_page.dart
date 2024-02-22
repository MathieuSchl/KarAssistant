import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/the_only_one.dart';
import 'package:kar_assistant/screens/my_games/the_only_one/view/the_only_one_play_screen.dart';
import 'package:kar_assistant/screens/my_games/touch_play/view/touch_play_screen.dart';

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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Theme(
              data: ThemeData(
                useMaterial3: true,
                textTheme: GoogleFonts.pressStart2pTextTheme().apply(
                  bodyColor: const Color(0xff184e77),
                  displayColor: const Color(0xff184e77),
                ),
              ),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const TouchPlayScreen(),
                    ),
                  );
                },
                child: const Text('Dont Fall Game'),
              ),
            ),
            SizedBox(
              height: 40,
            ),
            Theme(
              data: ThemeData(
                useMaterial3: true,
                textTheme: GoogleFonts.pressStart2pTextTheme().apply(
                  bodyColor: const Color(0xff184e77),
                  displayColor: const Color(0xff184e77),
                ),
              ),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const TheOnlyOnePlayScreen(),
                    ),
                  );
                },
                child: const Text('The Only One'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:kar_assistant/screens/home_page/view/home_page.dart';
import 'package:kar_assistant/services/utils_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await UtilsController().initEnv();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KarAssistant',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

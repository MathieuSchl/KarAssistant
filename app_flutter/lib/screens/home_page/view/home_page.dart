import 'package:flutter/material.dart';
import 'package:kar_assistant/assets/bottom_app_bar.dart';
import 'package:kar_assistant/screens/home_page/view/kara_talking.dart';
import 'package:kar_assistant/screens/home_page/controller/kara_controller.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  final String title = " title"; 
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final KaraController karaController = KaraController(); 

    @override
  void initState() {
    super.initState();
  }

 
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My name is Kara"),
        backgroundColor: Theme.of(context).colorScheme.primary,
        leading: const Icon(MdiIcons.home) ,),
      body:Center(
          child:KaraTalking(karaController)
        ),
      floatingActionButton: Semantics(
        container: true,
        child: FloatingActionButton(
          onPressed: () {},
          tooltip: 'New',
          child: const Icon(Icons.add),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: const MyAppBarBottom(
        shape: CircularNotchedRectangle(),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:kar_assistant/services/utils_controller.dart';

class MenuPage extends StatefulWidget {
  final BottomNavigationBarItem item;
  const MenuPage(this.item, {super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Menu'));
  }
}

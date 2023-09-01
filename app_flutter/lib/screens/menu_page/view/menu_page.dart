import 'package:flutter/material.dart';

class MenuPage extends StatefulWidget {
  final BottomNavigationBarItem item;
  const MenuPage(this.item, {super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Semantics(
        label: widget.item.label,
        child: widget.item.icon,
      ),
    );
  }
}

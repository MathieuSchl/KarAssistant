import 'package:flutter/material.dart';

class ActionsPage extends StatefulWidget {
  final BottomNavigationBarItem item;
  const ActionsPage(this.item, {super.key});

  @override
  State<ActionsPage> createState() => _ActionsPageState();
}

class _ActionsPageState extends State<ActionsPage> {
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

import 'package:flutter/material.dart';

class ParametersPage extends StatefulWidget {
  final BottomNavigationBarItem item;
  const ParametersPage(this.item, {super.key});

  @override
  State<ParametersPage> createState() => _ParametersPageState();
}

class _ParametersPageState extends State<ParametersPage> {
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

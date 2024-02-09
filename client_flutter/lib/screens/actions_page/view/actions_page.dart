import 'package:flutter/material.dart';
import 'package:kar_assistant/core/widgets/work_in_progress.dart';

class ActionsPage extends StatefulWidget {
  const ActionsPage({super.key});

  @override
  State<ActionsPage> createState() => _ActionsPageState();
}

class _ActionsPageState extends State<ActionsPage> {
  @override
  Widget build(BuildContext context) {
    return const WorkInProgress();
  }
}

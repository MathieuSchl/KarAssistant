import 'package:flutter/material.dart';
import 'package:kar_assistant/core/widgets/work_in_progress.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

class DiscordDialogConfigure extends StatelessWidget {
  const DiscordDialogConfigure({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      titleTextStyle: const TextStyle(fontSize: 20, color: Colors.black),
      title: const Row(
        children: [
          Icon(
            MdiIcons.discord,
            color: Color(0xff5865F2),
            size: 25,
          ),
          Text(
            'Lier votre compte discord',
          ),
        ],
      ),
      content: const SizedBox(
        width: 150,
        height: 150,
        child: WorkInProgress(),
      ),
      actionsAlignment: MainAxisAlignment.start,
      actions: [
        ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Annuler'))
      ],
    );
  }
}

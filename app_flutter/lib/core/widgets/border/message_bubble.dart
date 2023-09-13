import 'package:flutter/material.dart';
import 'package:kar_assistant/core/widgets/border/message_border.dart';

class MessageBubble extends StatelessWidget {
  final String msg;
  const MessageBubble({super.key, required this.msg});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.center,
        child: Container(
          constraints: const BoxConstraints(
            minWidth: 50
          ),
        decoration: ShapeDecoration(
          color: Theme.of(context).colorScheme.primary,
          shape: MessageBorder(),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          child: Text(
            msg,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15.0,
            ),
          ),
        ),
      ),
    );
  }
}

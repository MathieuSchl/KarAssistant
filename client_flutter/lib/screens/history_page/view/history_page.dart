import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:kar_assistant/core/models/conversation/message_conversation.dart';
import 'package:kar_assistant/screens/home_page/controller/kara_controller.dart';

class HystoryPage extends StatefulWidget {
  final KaraController karaController;
  const HystoryPage({required this.karaController, super.key});

  @override
  State<HystoryPage> createState() => _HystoryPageState();
}

class _HystoryPageState extends State<HystoryPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    List<MessageConversation> listMessages = widget.karaController.listResponse;
    final colorScheme = Theme.of(context).colorScheme;
    return Center(
      child: ListView.builder(
        reverse: true,
        itemCount: listMessages.length,
        shrinkWrap: true,
        padding: const EdgeInsets.only(top: 10, bottom: 30),
        itemBuilder: (context, index) {
          return Container(
            padding: EdgeInsets.only(
              left: listMessages[index].type == TypeConversation.kara ? 14 : 70,
              right:
                  listMessages[index].type == TypeConversation.kara ? 70 : 14,
              top: 10,
              bottom: 10,
            ),
            child: Align(
              alignment: (listMessages[index].type == TypeConversation.kara
                  ? Alignment.topLeft
                  : Alignment.topRight),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: (listMessages[index].type == TypeConversation.kara
                      ? colorScheme.primary
                      : Colors.blue[200]),
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Flexible(
                      child: Text(
                        listMessages[index].text,
                        style: TextStyle(
                          fontSize: 15,
                          color:
                              listMessages[index].type == TypeConversation.kara
                                  ? Colors.white
                                  : null,
                        ),
                      ),
                    ),
                    listMessages[index].type == TypeConversation.recording
                        ? const SpinKitWave(
                            color: Colors.white,
                            size: 10,
                          )
                        : Container(),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

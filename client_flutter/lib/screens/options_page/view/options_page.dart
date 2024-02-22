import 'package:flutter/material.dart';
import 'package:kar_assistant/core/widgets/work_in_progress.dart';
import 'package:kar_assistant/main.dart';
import 'package:kar_assistant/services/utils_controller.dart';

class OptionsPage extends StatelessWidget {
  const OptionsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Options",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          const Expanded(child: WorkInProgress()),
          Expanded(
            child: Column(
              children: [
                ElevatedButton(
                  style: ButtonStyle(
                    backgroundColor: MaterialStateProperty.resolveWith(
                      (Set<MaterialState> states) {
                        if (states.contains(MaterialState.pressed)) {
                          return Colors.red;
                        } else {
                          return Colors.transparent;
                        }
                      },
                    ),
                  ),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: const Text(
                            'Attention',
                          ),
                          content: const Text(
                            'Vous allez suprimmer votre compte et en créé un nouveau, êtes vous sur ?',
                            style: TextStyle(color: Colors.red),
                          ),
                          actions: [
                            ElevatedButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              child: const Text('Annuler'),
                            ),
                            ElevatedButton(
                              onPressed: () async {
                                UtilsController().removeToken().then((value) {
                                  Navigator.of(context)
                                      .popUntil((route) => false);
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => const MyApp(),
                                    ),
                                  );
                                  // final SnackBar snackBar = SnackBar(
                                  //   content: const Row(
                                  //     children: [
                                  //       Icon(MdiIcons.check),
                                  //       Text(
                                  //         'Compte supprimer',
                                  //         style: TextStyle(color: Colors.green),
                                  //       ),
                                  //     ],
                                  //   ),
                                  //   duration: const Duration(seconds: 4),
                                  //   backgroundColor: Colors.transparent,
                                  //   shape: RoundedRectangleBorder(
                                  //     borderRadius: BorderRadius.circular(5),
                                  //   ),
                                  //   behavior: SnackBarBehavior.floating,
                                  //   width: 200,
                                  // );
                                  // snackBarKey.currentState
                                  //     ?.showSnackBar(SnackBar(
                                  //   content: Text('test'),
                                  //   duration: Duration(seconds: 4),
                                  // ));
                                });
                              },
                              child: const Text('Confirmez'),
                            ),
                          ],
                        );
                      },
                    );
                  },
                  child: const Text('Supprimer le compte'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

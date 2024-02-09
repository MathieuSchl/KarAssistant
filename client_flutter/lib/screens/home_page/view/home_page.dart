import 'package:flutter/material.dart';
import 'package:animations/animations.dart';
import 'package:kar_assistant/screens/actions_page/view/actions_page.dart';
import 'package:kar_assistant/screens/history_page/view/history_page.dart';
import 'package:kar_assistant/screens/home_page/controller/kara_controller.dart';
import 'package:kar_assistant/screens/home_page/controller/user_controller.dart';
import 'package:kar_assistant/screens/home_page/view/kara_talking.dart';
import 'package:kar_assistant/screens/home_page/view/my_profil.dart';
import 'package:kar_assistant/services/utils_controller.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  final String title = " title";

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with RestorationMixin {
  final RestorableInt _currentIndexPage = RestorableInt(0);
  final PageController controllerPage = PageController(initialPage: 0);
  late KaraController karaController;
  late UserController userController;

  @override
  void initState() {
    print('restart App');
    karaController = KaraController();
    userController = UserController();
    UtilsController().verifTokenExistStorage().then((value) {
      userController.initInfoUser();
    });
    super.initState();
  }

  refresh() {
    setState(() {});
  }

  @override
  String get restorationId => 'bottom_nav_bar';

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_currentIndexPage, 'bottom_navigation_tab_index');
  }

  @override
  Widget build(BuildContext context) {
    final List<BottomNavigationBarItem> bottomNavigationBarItems =
        <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(
          Icons.list_sharp,
          size: 35,
          color: Theme.of(context).colorScheme.onPrimary.withOpacity(0.38),
        ),
        activeIcon: Icon(
          Icons.list_sharp,
          size: 35,
          color: Theme.of(context).colorScheme.onPrimary,
        ),
        label: 'Historique',
      ),
      BottomNavigationBarItem(
        icon: Icon(
          Icons.pending_actions,
          size: 35,
          color: Theme.of(context).colorScheme.onPrimary.withOpacity(0.38),
        ),
        activeIcon: Icon(
          Icons.pending_actions,
          size: 35,
          color: Theme.of(context).colorScheme.onPrimary,
        ),
        label: 'Actions',
      ),
    ];

    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Karasistant",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: colorScheme.primary,
        automaticallyImplyLeading: false,
        actions: const [MyProfil()],
      ),
      body: Center(
        child: PageTransitionSwitcher(
          transitionBuilder: (child, animation, secondaryAnimation) {
            return FadeThroughTransition(
              animation: animation,
              secondaryAnimation: secondaryAnimation,
              child: child,
            );
          },
          child: PageView(
            controller: controllerPage,
            onPageChanged: (newIndex) {
              setState(() {
                _currentIndexPage.value = newIndex;
              });
            },
            children: [
              HystoryPage(
                karaController: karaController,
              ),
              const ActionsPage(),
            ],
          ),
        ),
      ),
      floatingActionButton: KaraTalking(
        karaController,
        updateParents: refresh,
        currentIndexPage: _currentIndexPage.value,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: Theme.of(context).colorScheme.primary,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(bottomNavigationBarItems.length + 1, (index) {
            int usedIndex = index >= 2 ? index - 1 : index;
            BottomNavigationBarItem item = bottomNavigationBarItems[usedIndex];
            if (index == 1) {
              return const SizedBox(width: 150);
            }
            return InkResponse(
              onTap: () {
                controllerPage.animateToPage(
                  usedIndex,
                  duration: (Duration(
                    milliseconds:
                        ((_currentIndexPage.value - usedIndex).abs() * 200),
                  )),
                  curve: Curves.linear,
                );
              },
              enableFeedback: true,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Align(
                      alignment: Alignment.topCenter,
                      heightFactor: 1.0,
                      child: _currentIndexPage.value == usedIndex
                          ? item.activeIcon
                          : item.icon,
                    ),
                    _currentIndexPage.value == usedIndex
                        ? Text(
                            item.label!,
                            style: TextStyle(
                              fontSize: textTheme.bodySmall!.fontSize!,
                              color: colorScheme.onPrimary,
                            ),
                          )
                        : Container(),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

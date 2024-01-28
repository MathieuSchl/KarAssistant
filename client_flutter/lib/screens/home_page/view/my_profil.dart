import 'package:flutter/material.dart';
import 'package:kar_assistant/screens/home_page/view/discord_dialogue_configure.dart';
import 'package:kar_assistant/screens/options_page/view/options_page.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

class MyProfil extends StatefulWidget {
  const MyProfil({super.key});

  @override
  State<MyProfil> createState() => _MyProfilState();
}

class _MyProfilState extends State<MyProfil> {
  bool profilLoaded = false;

  PopupMenuItem buildMenuItem({
    required String title,
    required IconData iconData,
    Color? color,
  }) {
    return PopupMenuItem(
      value: title,
      height: 50,
      child: Row(
        children: [
          Expanded(child: Text(title)),
          Icon(
            iconData,
            color: color ?? Colors.blue,
            size: 25,
          ),
        ],
      ),
    );
  }

  List<PopupMenuItem<dynamic>> getMenu() {
    List<PopupMenuItem<dynamic>> list = [];
    list.add(
      buildMenuItem(
        title: 'Discord',
        iconData: MdiIcons.discord,
        color: const Color(0xff5865F2),
      ),
    );
    list.add(buildMenuItem(title: 'Options', iconData: MdiIcons.cogOutline));
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      child: PopupMenuButton(
        offset: const Offset(0, 60),
        itemBuilder: (ctx) => getMenu(),
        onSelected: (value) {
          switch (value) {
            case 'Discord':
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return const DiscordDialogConfigure();
                },
              );
              break;
            case 'Options':
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const OptionsPage(),
                ),
              );
              break;
          }
        },
        child: CircleAvatar(
          child: profilLoaded
              ? const Icon(MdiIcons.account)
              : const Icon(MdiIcons.accountAlert),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class MyAppBarBottom extends StatelessWidget {
  const MyAppBarBottom({super.key, 
    this.shape,
  });
  final NotchedShape? shape;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: 'bottomBar',
      child: BottomAppBar(
        shape: shape,
        child: IconTheme(
          data: IconThemeData(color: Theme.of(context).colorScheme.onPrimary),
          child: Row(
            children: [
              IconButton(
                tooltip: MaterialLocalizations.of(context).openAppDrawerTooltip,
                icon: const Icon(Icons.menu),
                onPressed: () {},
              ),
              const Spacer(),
              IconButton(
                tooltip: 'Demande favorite',
                icon: const Icon(Icons.favorite),
                onPressed: () {},
              )
            ],
          ),
        ),
      ),
    );
  }
}
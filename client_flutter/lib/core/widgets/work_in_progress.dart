import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

class WorkInProgress extends StatelessWidget {
  const WorkInProgress({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            MdiIcons.trafficCone,
            size: 45,
            color: Theme.of(context).primaryColor,
          ),
          const Text('Work in Progress'),
        ],
      ),
    );
    ;
  }
}

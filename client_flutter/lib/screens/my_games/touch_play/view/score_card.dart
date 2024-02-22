import 'package:flutter/material.dart';

class ScoreCard extends StatelessWidget {
  const ScoreCard({
    super.key,
    required this.score,
    required this.bestScore,
  });

  final ValueNotifier<int> score;
  final ValueNotifier<int> bestScore;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 6, 12, 18),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ValueListenableBuilder<int>(
            valueListenable: bestScore,
            builder: (context, bestScore, child) {
              return Text(
                'Best Score: $bestScore'.toUpperCase(),
                style: Theme.of(context).textTheme.titleLarge!,
              );
            },
          ),
          const SizedBox(
            height: 10,
          ),
          ValueListenableBuilder<int>(
            valueListenable: score,
            builder: (context, score, child) {
              return Text(
                'Score: $score'.toUpperCase(),
                style: Theme.of(context).textTheme.titleLarge!,
              );
            },
          ),
        ],
      ),
    );
  }
}

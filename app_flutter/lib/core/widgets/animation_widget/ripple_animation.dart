import 'package:flutter/material.dart';
class RipplesAnimation extends StatefulWidget {
  final double size;
  final Color color;
  final Widget child;


  const RipplesAnimation({
    super.key,
    this.size = 80.0,
    this.color = Colors.red,
    required this.child
  });

  @override
  _RipplesAnimationState createState() => _RipplesAnimationState();
}

class _RipplesAnimationState extends State<RipplesAnimation> with TickerProviderStateMixin {
  late AnimationController _controller;
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat();
  }
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  Widget _button() {
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(widget.size),
        child: DecoratedBox(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              colors: <Color>[
                widget.color,
              ],
            ),
          ),
          child: ScaleTransition(
              scale: Tween(begin: 0.95, end: 1.0).animate(
                CurvedAnimation(
                  parent: _controller,
                  curve: Curves.fastLinearToSlowEaseIn
                ),
              ),
              child: widget.child
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
        child: CustomPaint(
          foregroundPainter: CirclePainter(),
          child: SizedBox(
            width: widget.size * 4.125,
            height: widget.size * 4.125,
            child: _button(),
          ),
        ),
    );
  }
}

class CirclePainter extends CustomPainter {
  var wavePaint = Paint()
    ..color = Colors.black
    ..style = PaintingStyle.stroke
    ..strokeWidth = 2.0
    ..isAntiAlias = true;
  @override
  void paint(Canvas canvas, Size size) {
    double centerX = size.width / 2.0;
    double centerY = size.height / 2.0;
    canvas.drawCircle(Offset(centerX, centerY), 100.0, wavePaint);
  }
  @override
  bool shouldRepaint(CirclePainter oldDelegate) {
    return false;
  }
}
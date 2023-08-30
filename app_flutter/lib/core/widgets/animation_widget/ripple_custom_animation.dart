import 'package:flutter/material.dart';
import 'package:kar_assistant/core/widgets/animation_widget/ripple_custom_model.dart';

class RippleCustomAnimation extends StatefulWidget {
  const RippleCustomAnimation({
    Key? key,
    required this.child,
    required this.size,
    required this.minRadius,
    this.color= Colors.teal,
    this.repeat=false,
    this.delay=const Duration(milliseconds: 0),
    this.duration=const Duration(milliseconds: 2300),
    this.ripplesCount=60,
  }) : super(key: key);

  final Widget child;
  final Size size;
  final Duration delay;
  final double minRadius;
  final Color color;
  final int ripplesCount;
  final Duration duration;
  final bool repeat;

  @override
  State<RippleCustomAnimation> createState() => RippleCustomAnimationState();
}

class RippleCustomAnimationState extends State<RippleCustomAnimation> with TickerProviderStateMixin {
  Widget get child=>widget.child;
  double get radius=>widget.minRadius;
  Duration get delay =>widget.delay;
  Duration get duration =>widget.duration;
  bool get repeat =>widget.repeat;
  Color get color=> widget.color;
  int get rippleCount=> widget.ripplesCount;
  AnimationController ? animationController;

 @override
  void initState() {
    animationController=AnimationController(vsync: this, duration:duration);
    super.initState();
  }

  @override
  void dispose() {
    animationController!.dispose();
    super.dispose();
  }

  void startAnimate(){
    animationController!.repeat();
  }

  void stopAnimate(){
    animationController!.reset();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size.width,
      height: widget.size.height,
      child: CustomPaint(
        painter: AnimatedCircle(
            animationController,
            minRadius: radius,
            wavesCount: rippleCount +2,
            color: color,
            key: UniqueKey()
        ),
        child: child,
      )
    );
  }
}
import 'package:flutter/material.dart';

class MessageBorder extends ShapeBorder {
  final bool usePadding;

  MessageBorder({this.usePadding = true});

  @override
  EdgeInsetsGeometry get dimensions =>
      EdgeInsets.only(bottom: usePadding ? 20 : 0);

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) => Path();

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) {
    rect = Rect.fromPoints(rect.topLeft, rect.bottomRight - Offset(0, 20));
    return Path()
      ..addRRect(
          RRect.fromRectAndRadius(rect, Radius.circular(rect.height / 2)))
      ..moveTo(rect.bottomCenter.dx - 10, rect.bottomCenter.dy)
      ..relativeLineTo(10, 20)
      ..relativeLineTo(10, -20)
      ..close();
  }

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {}

  @override
  ShapeBorder scale(double t) => this;
}

// class MessageBorder extends OutlinedBorder {
//   final BorderRadius borderRadius;
//   final Color backgroundColor;
//   final String trianglePositon;
//   const MessageBorder({
//     super.side = BorderSide.none,
//     this.borderRadius = BorderRadius.zero,
//     this.trianglePositon = 'right',
//     required this.backgroundColor,

//   });

//   @override
//   MessageBorder copyWith(
//       {BorderSide? side, BorderRadius? borderRadius, Color? backgroundColor}) {
//     return MessageBorder(
//       borderRadius: borderRadius ?? this.borderRadius,
//       side: side ?? this.side,
//       backgroundColor: backgroundColor ?? this.backgroundColor,
//     );
//   }

//   @override
//   ShapeBorder scale(double t) {
//     return MessageBorder(
//       side: side.scale(t),
//       borderRadius: borderRadius * t,
//       backgroundColor: backgroundColor,
//     );
//   }

//   @override
//   EdgeInsetsGeometry get dimensions => const EdgeInsets.all(8.0);

//   @override
//   Path getInnerPath(Rect rect, {TextDirection? textDirection}) {
//     return Path()
//       ..addRRect(borderRadius
//           .resolve(textDirection)
//           .toRRect(rect)
//           .deflate(side.width));
//   }

//   @override
//   Path getOuterPath(Rect rect, {TextDirection? textDirection}) {
//     return Path()..addRRect(borderRadius.resolve(textDirection).toRRect(rect));
//   }

//   Offset getSideRect(Rect rect){
//     if(trianglePositon == 'left'){
//       return rect.bottomLeft;
//     }else{
//       return rect.bottomRight;
//     }
//   }

//   void _paintTriangle(Canvas canvas, Rect rect, int triangleVerticalDistance) {
//     final Paint tranglePaint = Paint();
//     tranglePaint.color = backgroundColor;
//     Path path = Path();
//     if(trianglePositon == 'left'){
//       path.moveTo(rect.bottomLeft.dx,
//           rect.bottomLeft.dy - borderRadius.bottomLeft.x - 1);
//       path.lineTo(rect.bottomLeft.dx + triangleVerticalDistance,
//           rect.bottomLeft.dy + triangleVerticalDistance);

//     }else {
//       path.moveTo(rect.bottomRight.dx - borderRadius.bottomRight.x - 1,
//           rect.bottomRight.dy);
//       path.lineTo(rect.bottomRight.dx + triangleVerticalDistance,
//           rect.bottomRight.dy + triangleVerticalDistance);
//       path.lineTo(rect.bottomRight.dx,
//           rect.bottomRight.dy - borderRadius.bottomRight.y - 1);
//     }
//     path.close();
//     canvas.drawPath(path, tranglePaint);

//   }

//   void _paintTriangleSide(
//       Canvas canvas, Rect rect, int triangleVerticalDistance) {
//     final Paint trangleSide = Paint();
//     trangleSide.color = side.color;
//     trangleSide.strokeWidth = side.width;
//     canvas.drawLine(
//       Offset(rect.bottomRight.dx - borderRadius.bottomRight.x,
//           rect.bottomRight.dy - (side.width / 2)),
//       Offset(rect.bottomRight.dx + triangleVerticalDistance + 1,
//           rect.bottomRight.dy + triangleVerticalDistance + 1),
//       trangleSide,
//     );
//     canvas.drawLine(
//       Offset(rect.bottomRight.dx + 4, rect.bottomRight.dy + 4),
//       Offset(rect.bottomRight.dx - (side.width / 2),
//           rect.bottomRight.dy - borderRadius.bottomRight.y),
//       trangleSide,
//     );
//   }

//   @override
//   void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
//     const int triangleVerticalDistance = 3;
//     final Paint borderPaint = Paint()..color = side.color;
//     switch (side.style) {
//       case BorderStyle.none:
//         _paintTriangle(canvas, rect, triangleVerticalDistance);
//         break;
//       case BorderStyle.solid:
//         final double width = side.width;

//         if (width == 0.0) {
//           canvas.drawRRect(borderRadius.resolve(textDirection).toRRect(rect),
//               side.toPaint());

//           _paintTriangle(canvas, rect, triangleVerticalDistance);
//         } else {
//           final RRect outer = borderRadius.resolve(textDirection).toRRect(rect);
//           final RRect inner = outer.deflate(width);
//           canvas.drawDRRect(outer, inner, borderPaint);

//           _paintTriangle(canvas, rect, triangleVerticalDistance);

//           _paintTriangleSide(canvas, rect, triangleVerticalDistance);
//         }
//     }
//   }
// }

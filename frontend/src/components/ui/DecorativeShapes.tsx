import React from 'react';

// This component previously contained animated decorative shapes.
// Reverting to empty component as part of design rollback.

interface DecorativeShapesProps {
  variant?: 'principal' | 'teacher' | 'admin';
  className?: string;
}

export function DecorativeShapes({ variant = 'teacher', className = '' }: DecorativeShapesProps) {
  return null;
}

export default DecorativeShapes;

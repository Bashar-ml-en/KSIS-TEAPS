// Declarations for static asset imports (images, fonts, etc.)
// Prevents TypeScript errors like "Cannot find module '*.jpg'"

declare module '*.avif';
declare module '*.bmp';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.webp';
declare module '*.ico';

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}

export {};

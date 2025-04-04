// react-extensions.d.ts
import 'react';

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // Add the non-standard directory attributes
    directory?: string;
    webkitdirectory?: string;
    mozdirectory?: string;
  }
}
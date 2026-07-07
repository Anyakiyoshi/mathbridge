import { useEffect, useRef } from 'react';
import katex from 'katex';

interface FormulaProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export default function Formula({ latex, displayMode = false, className = '' }: FormulaProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(latex, ref.current, {
        displayMode,
        throwOnError: false,
        trust: true,
      });
    }
  }, [latex, displayMode]);

  return <span ref={ref} className={className} />;
}

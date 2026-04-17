import type { RefObject } from "react";
import { useReactToPrint } from "react-to-print";

export const showPrintAdvisory = (): boolean => {
  return window.confirm("Set Scale to 100% (Actual Size) and Paper Size to A4 for accurate label alignment.");
};

type UsePrintSheetOptions = {
  contentRef: RefObject<HTMLDivElement | null>;
};

export const usePrintSheet = ({ contentRef }: UsePrintSheetOptions): (() => void) => {
  const print = useReactToPrint({
    contentRef,
    documentTitle: "label-sheet",
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return () => {
    if (showPrintAdvisory()) {
      void print();
    }
  };
};

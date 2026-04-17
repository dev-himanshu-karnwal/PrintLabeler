import { useMemo, type RefObject } from "react";
import { useReactToPrint } from "react-to-print";

type PrintMarginsMm = {
  marginMmTop: number;
  marginMmRight: number;
  marginMmBottom: number;
  marginMmLeft: number;
};

type UsePrintSheetOptions = {
  contentRef: RefObject<HTMLDivElement | null>;
} & PrintMarginsMm;

const clampMargin = (value: number): number =>
  Number.isFinite(value) && value > 0 ? value : 0;

export const usePrintSheet = ({
  contentRef,
  marginMmTop,
  marginMmRight,
  marginMmBottom,
  marginMmLeft,
}: UsePrintSheetOptions): (() => void) => {
  const top = clampMargin(marginMmTop);
  const right = clampMargin(marginMmRight);
  const bottom = clampMargin(marginMmBottom);
  const left = clampMargin(marginMmLeft);

  const pageStyle = useMemo(
    () => `
      @page {
        size: A4;
        margin: ${top}mm ${right}mm ${bottom}mm ${left}mm;
      }
      @media print {
        body {
          margin: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    [top, right, bottom, left]
  );

  const print = useReactToPrint({
    contentRef,
    documentTitle: "label-sheet",
    pageStyle,
  });

  return () => {
    void print();
  };
};

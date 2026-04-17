export const showPrintAdvisory = (): boolean => {
  return window.confirm("Set Scale to 100% (Actual Size) and Paper Size to A4 for accurate label alignment.");
};

export const printSheet = (): void => {
  if (showPrintAdvisory()) {
    window.print();
  }
};

import type { LabelCell } from "@/types/cell";
import type { SheetLayout } from "@/types/layout";

export const TEMPLATE_SCHEMA_VERSION = 1;

export type LabelTemplate = {
  id: string;
  name: string;
  version: number;
  layout: SheetLayout;
  cells: LabelCell[];
  updatedAt: string;
};

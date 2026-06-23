export type ViewMode = "read" | "edit" | "source";

export type Locale = "en" | "zh";

export type ThemeMode = "light" | "dark";

export type SyncState = "clean" | "edited";

export interface OutlineItem {
  id: string;
  text: string;
  depth: number;
}

export interface ExportChoice {
  id: "html" | "pdf" | "markdown";
  label: string;
}

export {};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    arbHeadClass?: string;
    arbCellClass?: string;
  }
}

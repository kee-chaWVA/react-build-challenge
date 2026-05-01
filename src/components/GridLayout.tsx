import React from "react";
import type { ReactNode } from "react";
import Grid from "@mui/material/Grid";

type GridLayoutProps = {
  columns: number;
  gap?: number;
  children: ReactNode;
};

export function GridLayout({ columns, gap = 2, children }: GridLayoutProps) {
  const columnSize = 12 / columns;

  return (
    <Grid container spacing={gap}>
      {React.Children.map(children, (child) => (
        <Grid size={columnSize}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
}
import { createStyles, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";

type LayoutProps = {
  children: React.ReactNode;
};

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: "#FAFAFA",
    height: "100%",
  },
  container: {
    marginLeft: 260,
    marginTop: 50,
  },
}));

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Layout({ children }: LayoutProps) {
  const { classes } = useStyles();

  return (
    <>
      <Group align="start" className={classes.root}>
        <NavBar />
        <div className={classes.container}>{children}</div>
      </Group>
    </>
  );
}

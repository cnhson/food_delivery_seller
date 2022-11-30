import { createStyles, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";

type LayoutProps = {
  children: React.ReactNode;
};

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: "#EDF2FF",
    height: "100%",
  },
  container: {
    marginLeft: 320,
    marginTop: 50,
  },
}));

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Layout({ children }: LayoutProps) {
  const { classes } = useStyles();

  useEffect(() => {}, []);

  timeout(3000);
  return (
    <>
      <Group align="start" className={classes.root}>
        <NavBar />
        <div className={classes.container}>{children}</div>
      </Group>
    </>
  );
}

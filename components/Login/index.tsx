import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Group,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://raw.githubusercontent.com/baonguyen120301/mustifi-assets/master/traditional-food-around-the-world-Travlinmad.jpg)",
  },
  link: {
    color: "#006EFA",
    fontSize: 14,
  },
  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: "100vh",
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

type TypeToLogin = {
  role_id: string;
  email: string;
  password: string;
};

export default function Login() {
  const { classes } = useStyles();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
  const [emptyPassword, setEmptyPassword] = useState<boolean>(false);

  async function Login() {
    // check all fields
    if (email === "" || password === "") {
      if (email === "") {
        setEmptyEmail(true);
      } else {
        setEmptyEmail(false);
      }
      if (password === "") {
        setEmptyPassword(true);
      } else {
        setEmptyPassword(false);
      }
      return;
    }

    setEmptyEmail(false);
    setEmptyPassword(false);

    try {
      const data: TypeToLogin = {
        role_id: "SEL",
        email: email,
        password: password,
      };

      const response = await axios.post(
        `${process.env.API}account/login`,
        data
      );
      const { error, message } = response.data;
      if (error) {
        alert(error);
      } else {
        alert(message);
      }
    } catch (err) {
      //@ts-ignore
      alert(err.response.data.error);
    }
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          weight={700}
        >
          Welcome back
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          onChange={(value) => setEmail(value.currentTarget.value)}
          error={emptyEmail}
        />
        {emptyEmail ? (
          <Text fz="xs" c="red">
            Name is required
          </Text>
        ) : (
          <></>
        )}
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          onChange={(value) => setPassword(value.currentTarget.value)}
          error={emptyPassword}
        />
        {emptyPassword ? (
          <Text fz="xs" c="red">
            Password is required
          </Text>
        ) : (
          <></>
        )}
        <Group position="apart" mt="lg">
          <Checkbox label="Keep me logged in" sx={{ lineHeight: 1 }} />
          <Link href="/forgot-password" className={classes.link}>
            Forgot password?
          </Link>
        </Group>

        <Button fullWidth mt="xl" size="md" onClick={Login}>
          Login
        </Button>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Link href="./register" className={classes.link}>
            Register
          </Link>
        </Text>
      </Paper>
    </div>
  );
}

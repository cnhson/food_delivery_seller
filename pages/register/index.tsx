import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  createStyles,
} from "@mantine/core";
import { IconAt } from "@tabler/icons";
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
  },
}));

type TypeInsertAccount = {
  role_id: string;
  name: string;
  email: string;
  password: string;
  timestamp: string;
};

export default function Register() {
  const { classes } = useStyles();

  // field of data
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPass, setRepeatPass] = useState<string>("");
  const [match, setMatch] = useState<boolean>(true);
  const [emptyName, setEmptyName] = useState<boolean>(false);
  const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
  const [emptyPassword, setEmptyPassword] = useState<boolean>(false);

  async function Register() {
    // check all fields
    if (name === "" || email === "" || password === "") {
      if (name === "") {
        setEmptyName(true);
        console.log(emptyName);
      } else {
        setEmptyName(false);
      }
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
    if (password !== repeatPass) {
      setMatch(false);
      return;
    }

    setMatch(true);
    setEmptyName(false);
    setEmptyEmail(false);
    setEmptyPassword(false);

    // create account
    const timestamp = new Date().getTime();
    const data: TypeInsertAccount = {
      role_id: "SEL",
      name: name,
      email: email,
      password: password,
      timestamp: timestamp.toString(),
    };

    try {
      const response = await axios.post(
        `${process.env.API}account/register`,
        data
      );

      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      // @ts-ignore
      alert(err.response.data.error);
    }
  }

  return (
    <Group position="center" className={classes.wrapper}>
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title
            align="center"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Be Our Partner!
          </Title>
          <TextInput
            label="Full name"
            placeholder="Nguyen Van A"
            mt="md"
            required
            onChange={(value) => setName(value.currentTarget.value)}
            error={emptyName}
          />
          {emptyName ? (
            <Text fz="xs" c="red">
              Name is required
            </Text>
          ) : (
            <></>
          )}
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            mt="md"
            icon={<IconAt size={14} />}
            onChange={(value) => setEmail(value.currentTarget.value)}
            error={emptyEmail}
          />
          {emptyEmail ? (
            <Text fz="xs" c="red">
              Email is required
            </Text>
          ) : (
            <></>
          )}
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
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
          <PasswordInput
            label="Password"
            placeholder="Repeat password"
            required
            mt="md"
            onChange={(value) => setRepeatPass(value.currentTarget.value)}
            error={!match}
          />
          {!match ? (
            <Text fz="xs" c="red">
              Repeat password does not match
            </Text>
          ) : (
            <></>
          )}
          <Text color="dimmed" size="sm" align="center" mt="md">
            Already has account?{" "}
            <Link href="/" className={classes.link}>
              Login
            </Link>
          </Text>
          <Button fullWidth mt="xs" onClick={Register}>
            Register
          </Button>
        </Paper>
      </Container>
    </Group>
  );
}

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
import Link from "next/link";

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

export default function Register() {
  const { classes } = useStyles();
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
            mb="md"
            mt="md"
            required
          />
          <TextInput label="Email" placeholder="you@mantine.dev" required />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Repeat password"
            required
            mt="md"
          />
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Already has account?{" "}
            <Link href="/" className={classes.link}>
              Login
            </Link>
          </Text>
          <Button fullWidth mt="xl">
            Register
          </Button>
        </Paper>
      </Container>
    </Group>
  );
}

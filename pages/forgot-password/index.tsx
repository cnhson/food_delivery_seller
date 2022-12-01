import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://raw.githubusercontent.com/baonguyen120301/mustifi-assets/master/traditional-food-around-the-world-Travlinmad.jpg)",
  },
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

export default function ForgotPassword() {
  const { classes } = useStyles();

  return (
    <Group position="center" className={classes.wrapper}>
      <Container size={460} my={30}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <Title className={classes.title} align="center">
            Forgot your password?
          </Title>
          <Text color="dimmed" size="sm" align="center">
            Enter your email to get a reset link
          </Text>
          <TextInput label="Your email" placeholder="me@mantine.dev" required />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor color="dimmed" size="sm" className={classes.control}>
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>
                  <Link href="/">Back to login page</Link>
                </Box>
              </Center>
            </Anchor>
            <Button className={classes.control}>Reset password</Button>
          </Group>
        </Paper>
      </Container>
    </Group>
  );
}

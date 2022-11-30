import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  image?: string;
  username: string;
  icon?: React.ReactNode;
}

export function UserButton({
  image,
  username,
  icon,
  ...others
}: UserButtonProps) {
  const { classes } = useStyles();

  let char = [];
  // for (let i = 0; i < address.length; i++) {
  //   char.push(address[i]);
  // }
  // const shortedAddress = [
  //   char[0],
  //   char[1],
  //   char[2],
  //   char[3],
  //   "...",
  //   char[char.length - 4],
  //   char[char.length - 3],
  //   char[char.length - 2],
  //   char[char.length - 1],
  //   char[char.length],
  // ];

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {username}
          </Text>

          <Text color="dimmed" size="xs">
            Admin
          </Text>
        </div>

        {icon || <IconChevronRight size={14} stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
}

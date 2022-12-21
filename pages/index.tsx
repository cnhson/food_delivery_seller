import { createStyles, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import {
  IconUserPlus,
  IconDiscount2,
  IconTicket,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
  IconHeart,
} from "@tabler/icons";
import Table from "../components/dashboard/Table";
import Chart from "../components/dashboard/Chart";

const useStyles = createStyles((theme) => ({
  root: {
    padding: 0,
    width: "75vw",
  },

  card: {
    width: 300,
    marginLeft: 15,
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  ticket: IconTicket,
  coin: IconCoin,
  heart: IconHeart,
};

interface StatsGridProps {
  data: {
    title: string;
    icon: keyof typeof icons;
    value: string;
    diff: number;
  }[];
}

export default function StatsGrid() {
  const data: StatsGridProps = {
    data: [
      {
        title: "Customer",
        icon: "user",
        value: "13,456",
        diff: 34,
      },
      {
        title: "Balance",
        icon: "coin",
        value: "13,456",
        diff: 34,
      },
      {
        title: "Favorite",
        icon: "heart",
        value: "13,456",
        diff: 34,
      },
      {
        title: "Orders",
        icon: "ticket",
        value: "13,456",
        diff: -10,
      },
    ],
  };
  const { classes } = useStyles();
  const stats = data.data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper
        ml={0}
        w={288}
        withBorder
        p="md"
        radius="md"
        key={stat.title}
        className={classes.card}
        shadow="0 0 35px rgb(127 150 174 / 10%);"
      >
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={stat.diff > 0 ? "teal" : "red"}
            size="sm"
            weight={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        </Group>

        <Text size="xs" color="dimmed" mt={7}>
          Compared to previous month
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
      <Chart />
      <Table />
    </div>
  );
}

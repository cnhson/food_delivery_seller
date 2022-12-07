import {
  createStyles,
  Table,
  Progress,
  Anchor,
  Text,
  Group,
  ScrollArea,
  Paper,
  Skeleton,
  Button,
} from "@mantine/core";
import Image from "next/image";
import arrowleft from "../../public/arrowleft.svg";
import arrowright from "../../public/arrowright.svg";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  progressBar: {
    "&:not(:first-of-type)": {
      borderLeft: `3px solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
      }`,
    },
  },
  pagination: {
    padding: 10,
    borderBottom: "1px solid #CACACA",
    marginBottom: 30,
  },
  paginationBottom: {
    padding: 10,
    borderTop: "1px solid #CACACA",
    marginTop: 30,
  },
  totalText: {
    color: "#898989",
  },
  paginationText: {
    display: "flex",
    padding: 8,
  },
  enableButtom: {
    color: "#0097FF",
  },
  tab: {
    width: 155,
  },
  root: {
    marginTop: 40,
    backgroundColor: "#EDF2FF",
    height: "100%",
    width: "80vw",
  },
}));

interface TableReviewsProps {
  name: string;
  last_date: string;
  orders: number;
  amount: number;
  percentage: string;
}

type Tab = "not accepted" | "accepted" | "shipping" | "success" | "failed";

export default function Orders() {
  const { classes } = useStyles();
  const [customers, setCustomers] = useState<Array<TableReviewsProps>>([]);
  const [tab, setTab] = useState<Tab>("not accepted");
  const [isFinish, setIsFinish] = useState<Boolean>(false);

  async function getAllCustomer() {
    setCustomers([
      {
        name: "baomap",
        last_date: "1665360000000",
        orders: 2,
        amount: 10000000,
        percentage: "40",
      },
      {
        name: "vynguyen",
        last_date: "1667235600000",
        orders: 1,
        amount: 58000,
        percentage: "10",
      },
      {
        name: "baovy",
        last_date: "1668297600000",
        orders: 5,
        amount: 2000000,
        percentage: "50",
      },
    ]);
    setIsFinish(true);
  }

  useEffect(() => {
    getAllCustomer();
  }, []);

  const rows = customers!.map((row) => {
    const latestDate = new Date(Number(row.last_date));

    return (
      <tr key={row.name}>
        <td>
          <Anchor<"a"> size="sm" onClick={(event) => event.preventDefault()}>
            {row.name}
          </Anchor>
        </td>
        <td>{latestDate.toString().slice(0, 25)}</td>
        <td>{row.orders}</td>
        <td>{Intl.NumberFormat().format(row.amount)}</td>
        <td>
          <Group position="left">
            <Text size="xs" transform="uppercase" weight={700} color="dimmed">
              Percentage of total revenue:
            </Text>
            <Text size="md" weight={500}>
              {row.percentage} %
            </Text>
          </Group>
          <Progress
            value={Number(row.percentage)}
            mt="md"
            size="lg"
            radius="xl"
          />
        </td>
      </tr>
    );
  });

  function Waiting() {
    return (
      <>
        <tr>
          <td>
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="90%" radius="xl" />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="90%" radius="xl" />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="50%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="90%" radius="xl" />
          </td>
        </tr>
      </>
    );
  }
  return (
    <div className={classes.root}>
      <Group position="left" mb={10}>
        <Button
          size="sm"
          variant={tab == "not accepted" ? "filled" : "default"}
          radius="md"
          className={classes.tab}
          onClick={() => {
            setTab("not accepted");
          }}
        >
          Not Accepted Yet
        </Button>
        <Button
          size="sm"
          variant={tab == "accepted" ? "filled" : "default"}
          radius="md"
          className={classes.tab}
          onClick={() => {
            setTab("accepted");
          }}
        >
          Accepted
        </Button>
        <Button
          size="sm"
          variant={tab == "shipping" ? "filled" : "default"}
          radius="md"
          className={classes.tab}
          onClick={() => {
            setTab("shipping");
          }}
        >
          Shipping
        </Button>
        <Button
          size="sm"
          variant={tab == "success" ? "filled" : "default"}
          radius="md"
          className={classes.tab}
          onClick={() => {
            setTab("success");
          }}
        >
          Success
        </Button>
        <Button
          size="sm"
          variant={tab == "failed" ? "filled" : "default"}
          radius="md"
          className={classes.tab}
          onClick={() => {
            setTab("failed");
          }}
        >
          Failed
        </Button>
      </Group>
      <Group position="center">
        <Paper withBorder p="md" radius="md" w="100vw">
          <Group position="apart" className={classes.pagination}>
            <span className={classes.totalText}>3 customers</span>
            <Paper>
              <nav>
                <ul>
                  <li>
                    <Button
                      variant="default"
                      disabled={true}
                      className={classes.enableButtom}
                      radius={5}
                      mr={2}
                    >
                      first
                    </Button>
                  </li>
                  <li>
                    <Button variant="default" disabled={true} radius={5} mr={2}>
                      <Image src={arrowleft} width={10} height={10} alt={""} />
                    </Button>
                  </li>
                  <li>
                    <Paper
                      withBorder
                      className={classes.paginationText}
                      fz="xs"
                      radius={5}
                      mr={2}
                    >
                      <span>
                        {" "}
                        Page <strong> 1 </strong>
                        of
                        <strong> 3 </strong>
                      </span>
                    </Paper>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={false}
                      radius={5}
                      mr={2}
                    >
                      <Image src={arrowright} width={10} height={10} alt={""} />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={false}
                      className={classes.enableButtom}
                      radius={5}
                    >
                      Last
                    </Button>
                  </li>
                </ul>
              </nav>
            </Paper>
          </Group>
          <ScrollArea>
            <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Total Price (USD)</th>
                  <th>Timestamp</th>
                  <th>Payment method</th>
                </tr>
              </thead>
              <tbody>{isFinish ? rows : <Waiting />}</tbody>
            </Table>
          </ScrollArea>
          <Group position="apart" className={classes.paginationBottom}>
            <span className={classes.totalText}>10 Customers per page</span>
            <Paper>
              <nav>
                <ul>
                  <li>
                    <Button
                      variant="default"
                      disabled={true}
                      className={classes.enableButtom}
                      radius={5}
                      mr={2}
                    >
                      first
                    </Button>
                  </li>
                  <li>
                    <Button variant="default" disabled={true} radius={5} mr={2}>
                      <Image src={arrowleft} width={10} height={10} alt={""} />
                    </Button>
                  </li>
                  <li>
                    <Paper
                      withBorder
                      className={classes.paginationText}
                      fz="xs"
                      radius={5}
                      mr={2}
                    >
                      <span>
                        {" "}
                        Page <strong> 1 </strong>
                        of
                        <strong> 3 </strong>
                      </span>
                    </Paper>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={false}
                      radius={5}
                      mr={2}
                    >
                      <Image src={arrowright} width={10} height={10} alt={""} />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={false}
                      className={classes.enableButtom}
                      radius={5}
                    >
                      Last
                    </Button>
                  </li>
                </ul>
              </nav>
            </Paper>
          </Group>
        </Paper>
      </Group>
    </div>
  );
}

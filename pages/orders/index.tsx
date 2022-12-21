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
  Modal,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import arrowleft from "../../public/arrowleft.svg";
import arrowright from "../../public/arrowright.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { IconCheck, IconTruckDelivery, IconBrowserCheck } from "@tabler/icons";
import moment from "moment";

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
  thead: {
    background: "#D1D1D1",
  },
  paginationText: {
    display: "flex",
    padding: 5,
  },
  enableButtom: {
    color: "#0097FF",
  },
  tab: {
    width: 155,
  },
  root: {
    marginTop: 40,
    backgroundColor: "#FAFAFA",
    height: "100%",
    width: "80vw",
  },
}));

interface TableReviewsProps {
  id: string;
  email: string;
  timestamp: string;
  product: string;
  product_id: number;
  proceed: number;
  payment_method: string;
}

type ProceedOrder = {
  order_id: string;
  product_id: number;
  store_id: string;
};

type Tab = "not received" | "received" | "shipping" | "success" | "failed";
type StatusId = "FAL" | "NRY" | "RCD" | "SHP" | "SUC";

export default function Orders() {
  const { classes } = useStyles();
  const [orders, setOrders] = useState<Array<TableReviewsProps>>([]);
  const [tab, setTab] = useState<Tab>("not received");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [opened, setOpened] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [productId, setProductId] = useState<number>(0);
  const theme = useMantineTheme();
  const store_id = sessionStorage.getItem("Store");
  const user_id = sessionStorage.getItem("User");

  async function getAllOrders(status: Tab) {
    let status_id: StatusId;
    switch (status) {
      case "not received":
        status_id = "NRY";
        break;
      case "received":
        status_id = "RCD";
        break;
      case "shipping":
        status_id = "SHP";
        break;
      case "success":
        status_id = "SUC";
        break;
      case "failed":
        status_id = "FAL";
        break;
    }

    try {
      const response = await axios.get(
        process.env.API +
          `order/get-store-orders?store_id=${store_id}&status_id=${status_id}&page=${currentPage}&size=${size}`
      );
      const data = response.data;
      setTotalOrders(data.total);
      setTotalPages(data.pages);
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setOrders(data.items);
    } catch (err) {
      console.log(err);
    }
    setIsFinish(true);
  }

  useEffect(() => {
    getAllOrders(tab);
  }, [tab]);

  async function ProceedOrder(order_id: string, product_id:number) {
    setLoading(true);

    // let status_id: StatusId = "RCD";
    // switch (tab) {
    //   case "not received":
    //     status_id = "RCD";
    //     break;
    //   case "received":
    //     status_id = "SHP";
    //     break;
    //   case "shipping":
    //     status_id = "SUC";
    //     break;
    // }

    const data: ProceedOrder = {
      order_id: order_id,
      product_id: product_id,
      store_id: store_id!,
    };

    try {
      const response = await axios.post(
        process.env.API + "order/proceed",
        data
      );
      if (response.data.error) {
        alert(response.data.error);
        setOpened(false);
        setLoading(false);
      } else {
        alert(response.data.message);
        setOpened(false);
        setLoading(false);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const rows = orders!.map((row) => {
    //const latestDate = new Date(Number(row.last_date));
    let Icon = IconCheck;
    switch (tab) {
      case "not received":
        Icon = IconBrowserCheck;
        break;
      case "received":
        Icon = IconTruckDelivery;
        break;
      case "shipping":
        Icon = IconCheck;
        break;
    }
    return (
      <tr key={row.id}>
        <td>
          <Anchor<"a"> size="sm" onClick={(event) => event.preventDefault()}>
            {row.id}
          </Anchor>
        </td>
        <td>{row.email}</td>
        <td>{row.product}</td>
        <td>
          {moment(row.timestamp).format("MM/DD/YYYY h:mm a")}{" "}
          <Text c="dimmed">({moment(row.timestamp).fromNow()})</Text>
        </td>
        <td>{row.payment_method}</td>
        <td>{row.proceed}</td>
        <td>
          <Button
            variant="default"
            onClick={() => {
              setOrderId(row.id);
              setProductId(row.product_id);
              setOpened(true);
            }}
          >
            <Icon size={22} stroke={1.5} />
          </Button>
        </td>
      </tr>
    );
  });

  function Waiting() {
    return (
      <>
        <tr>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
        </tr>
        <tr>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
          </td>
          <td>
            <Skeleton height={8} mt={6} width="100%" radius="xl" />
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
          variant={tab == "not received" ? "filled" : "default"}
          radius="md"
          className={classes.tab}
          onClick={() => {
            setTab("not received");
          }}
        >
          Not Accepted Yet
        </Button>
        <Button
          size="sm"
          variant={tab == "received" ? "filled" : "default"}
          radius="md"
          className={classes.tab}
          onClick={() => {
            setTab("received");
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
      <Group position="center" w={1320}>
        <Paper
          withBorder
          p="md"
          radius="md"          
          w="150vw"
          shadow="0 0 35px rgb(127 150 174 / 15%);"
        >
          <Group position="apart" className={classes.pagination}>
            <span className={classes.totalText}>
              Total {totalOrders} orders
            </span>
            <Paper>
              <nav>
                <ul>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : currentPage == 1}
                      className={classes.enableButtom}
                      radius={5}
                      mr={2}
                      size="xs"
                    >
                      first
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : !hasPrevious}
                      radius={5}
                      mr={2}
                      size="xs"
                    >
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
                        <strong> {totalPages} </strong>
                      </span>
                    </Paper>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : !hasNext}
                      radius={5}
                      mr={2}
                      size="xs"
                    >
                      <Image src={arrowright} width={10} height={10} alt={""} />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : currentPage == totalPages}
                      className={classes.enableButtom}
                      radius={5}
                      size="xs"
                    >
                      Last
                    </Button>
                  </li>
                </ul>
              </nav>
            </Paper>
          </Group>
          <Paper withBorder>
            <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
              <thead className={classes.thead}>
                <tr>
                  <th>ID</th>
                  <th>Users' Email</th>
                  <th>Product</th>
                  <th>Timestamp</th>
                  <th>Payment method</th>
                  <th>Proceed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{isFinish ? rows : <Waiting />}</tbody>
            </Table>
            {orders.length == 0 ? (
              <Group position="center">
                <Text color="#B4B4B4" fw={500} mt={50} mb={50}>
                  Empty
                </Text>
              </Group>
            ) : (
              <></>
            )}
          </Paper>
          <Group position="apart" className={classes.paginationBottom}>
            <span className={classes.totalText}>{size} orders per page</span>
            <Paper>
              <nav>
                <ul>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : currentPage == 1}
                      className={classes.enableButtom}
                      radius={5}
                      mr={2}
                      size="xs"
                    >
                      first
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : !hasPrevious}
                      radius={5}
                      mr={2}
                      size="xs"
                    >
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
                        <strong> {totalPages} </strong>
                      </span>
                    </Paper>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : !hasNext}
                      radius={5}
                      mr={2}
                      size="xs"
                    >
                      <Image src={arrowright} width={10} height={10} alt={""} />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      disabled={!isFinish ? true : currentPage == totalPages}
                      className={classes.enableButtom}
                      radius={5}
                      size="xs"
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
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Group position="center" mb={20}>
          <Text
            component="span"
            align="center"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            size="xl"
            weight={700}
            style={{ fontFamily: "Greycliff CF, sans-serif" }}
          >
            {tab == "not received"
              ? "RECEIVE ORDER"
              : tab == "received"
              ? "CONFIRM ORDER FOR SHIPPING"
              : tab == "shipping"
              ? "CONFIRM SHIPPING"
              : ""}
          </Text>
        </Group>
        <Group position="center" mb={20}>
          <Text
            component="span"
            align="center"
            weight={500}
            style={{ fontFamily: "Greycliff CF, sans-serif" }}
          >
            {tab == "not received"
              ? "Are you sure to accept this order?"
              : tab == "received"
              ? "Are you sure to delivery this order?"
              : tab == "shipping"
              ? "Are you sure want to confirm that this order is delivered successfully?"
              : ""}
          </Text>
        </Group>
        <Group position="center" mb={10}>
          <Button
            variant="gradient"
            gradient={{ from: "teal", to: "blue", deg: 60 }}
            fullWidth
            loading={loading}
            onClick={() => ProceedOrder(orderId, productId)}
          >
            Confirm
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

import {
  Button,
  createStyles,
  Group,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import { genRandonString } from "../../components/common";

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: 40,
    backgroundColor: "#FAFAFA",
    height: "100%",
    width: "75vw",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 40,
  },
  textInput: {
    width: 400,
  },
}));

type TypeOfCreateProductType = {
  id: string;
  name: string;
  store_id: string;
};

export default function NewProductType() {
  const { classes } = useStyles();

  // product info
  const [nameProductType, setNameProductType] = useState<string>("");

  // check if empty
  const [emptyName, setEmptyName] = useState<boolean>(false);

  // loading
  const [loading, setLoading] = useState<boolean>(false);

  async function createProduct() {
    setLoading(true);
    if (nameProductType === "") {
      setEmptyName(true);
      setLoading(false);
      return;
    }
    setEmptyName(false);

    const store_id = sessionStorage.getItem("Store");
    const data: TypeOfCreateProductType = {
      id: genRandonString(),
      name: nameProductType,
      store_id: store_id!,
    };

    try {
      const response = await axios.post(
        process.env.API + "menu/new-product-type",
        data
      );
      if (response.data.error) {
        alert(response.data.error);
        setLoading(false);
        return;
      }

      alert(response.data.message);
    } catch (err) {
      alert(err);
    }

    setLoading(false);
  }

  return (
    <div className={classes.root}>
      <Group position="center">
        <Paper
          withBorder
          p="xl"
          radius="md"
          shadow="0 0 35px rgb(127 150 174 / 15%);"
        >
          <Text
            className={classes.title}
            component="span"
            align="center"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            size="xl"
            weight={700}
            style={{ fontFamily: "Greycliff CF, sans-serif" }}
          >
            CREATE NEW PRODUCT TYPE
          </Text>
          <TextInput
            placeholder="What is your name of product's type"
            label="Name of the type"
            radius="md"
            withAsterisk
            className={classes.textInput}
            onChange={(value) => setNameProductType(value.currentTarget.value)}
            error={emptyName}
          ></TextInput>
          {emptyName ? (
            <Text fz="xs" c="red">
              Name is required
            </Text>
          ) : (
            <></>
          )}
          <Button mt="xl" fullWidth onClick={createProduct} loading={loading}>
            Create New Product Type
          </Button>
        </Paper>
      </Group>
    </div>
  );
}

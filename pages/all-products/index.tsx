import { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  //Checkbox,
  useMantineTheme,
  Group,
  Modal,
  Text,
  Paper,
  Button,
  FileInput,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Image,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import axios from "axios";
import { client } from "../../components/common";
//import Image from "next/image";

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: 40,
    backgroundColor: "#FAFAFA",
    height: "100%",
    width: "75vw",
  },
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  title: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 40,
  },
  thead: {
    background: "#D1D1D1",
  },
  textInput: {
    width: 400,
  },
}));

interface TableProducts {
  product_id: string;
  name: string;
  price: string;
  type: string;
}

type TypeProduct = {
  value: string;
  label: string;
};

type EditProduct = {
  id: string;
  store_id: string;
  name: string;
  description: string;
  type_id: string;
  image: string;
  price: string;
};

export default function TableSelection() {
  const [productArray, setProductArray] = useState<Array<TableProducts>>([]);
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const store_id = sessionStorage.getItem("Store");

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<any>();
  const [typeChosen, setTypeChosen] = useState<string>("");

  // product info
  const [idProduct, setIdProduct] = useState<string>("");
  const [nameProduct, setNameProduct] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageProduct, setImageProduct] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  // check if empty
  const [emptyName, setEmptyName] = useState<boolean>(false);
  const [emptyDescription, setEmptyDescription] = useState<boolean>(false);
  const [emptyPrice, setEmptyPrice] = useState<boolean>(false);
  const [emptyType, setEmptyType] = useState<boolean>(false);

  // type of product
  const [typeProduct, setTypeProduct] = useState<Array<TypeProduct>>([]);

  // loading
  const [loading, setLoading] = useState<boolean>(false);

  async function getAllProducts() {
    try {

      const response = await axios.get(
        process.env.API + "menu/get-all-products/" + store_id
      );

      if (response.data.length > 0) {
        const dataArray: Array<TableProducts> = [];
        for (let i = 0; i < response.data.length; i++) {
          const { id, name, price, type } = response.data[i];
          const data: TableProducts = {
            product_id: id,
            name: name,
            price: price,
            type: type,
          };

          dataArray.push(data);
        }

        setProductArray(dataArray);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // get all type of product
  async function getAllProductType() {
    const response = await axios.get(
      process.env.API + "menu/get-all-product-type/" + store_id
    );

    const types = response.data;
    let typeArray: Array<TypeProduct> = [];
    for (let i = 0; i < types.length; i++) {
      let data: TypeProduct = {
        value: "",
        label: "",
      };
      data.value = types[i].id;
      data.label = types[i].name;

      typeArray.push(data);
    }

    setTypeProduct(typeArray);
  }

  async function getProductInfo(product_id: string) {
    try {
      const response = await axios.get(
        process.env.API + "menu/get-product/" + product_id
      );

      const { name, type_id, description, image, price } = response.data[0];
      setNameProduct(name);
      setDescription(description);
      setPrice(price);
      setTypeChosen(type_id);
      setFileUrl(process.env.IPFS_URL + image);
      setImageProduct(image);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllProducts();
    getAllProductType();
  }, []);

  async function editProduct() {
    setLoading(true);
    if (
      nameProduct === "" ||
      description === "" ||
      price === 0 ||
      typeChosen === ""
    ) {
      // check if name is empty
      if (nameProduct === "") {
        setEmptyName(true);
      } else {
        setEmptyName(false);
      }

      // check if description is empty
      if (description === "") {
        setEmptyDescription(true);
      } else {
        setEmptyDescription(false);
      }

      // check if price = 0
      if (price === 0) {
        setEmptyPrice(true);
      } else {
        setEmptyPrice(false);
      }

      // check if type is empty
      if (typeChosen === "") {
        setEmptyType(true);
      } else {
        setEmptyType(false);
      }
      setLoading(false);
      return;
    }

    setEmptyName(false);
    setEmptyDescription(false);
    setEmptyPrice(false);
    setEmptyType(false);

    if (file !== null) {
      //save image into ipfs
      const fileAdded = await client.add(file);
      setImageProduct(fileAdded.path);
    }

    const data: EditProduct = {
      id: idProduct,
      store_id: store_id!,
      name: nameProduct,
      description: description,
      type_id: typeChosen,
      image: imageProduct,
      price: price.toString(),
    };

    try {
      const response = await axios.post(
        process.env.API + "menu/edit-product",
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

  const rows = productArray.map((item) => {
    const Icon = IconEdit;
    return (
      <tr key={item.product_id}>
        <td> {item.product_id}</td>
        <td>{item.name}</td>
        <td>$ {item.price}</td>
        <td>{item.type}</td>
        <td>
          <Button
            variant="default"
            onClick={() => {
              setOpened(true);
              setIdProduct(item.product_id);
              getProductInfo(item.product_id);
            }}
          >
            <Icon size={22} stroke={1.5} />
          </Button>
        </td>
      </tr>
    );
  });

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
            ALL PRODUCTS
          </Text>
          <Table withBorder sx={{ minWidth: 800 }} verticalSpacing="sm">
            <thead className={classes.thead}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Group</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          <Modal
            overlayColor={
              theme.colorScheme === "dark"
                ? theme.colors.dark[9]
                : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            opened={opened}
            size="auto"
            onClose={() => setOpened(false)}
          >
            <Paper>
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
                EDIT PRODUCT
              </Text>
              <Group position="apart" mb={50}>
                <Paper>
                  <FileInput
                    label="Your product&apos;s image"
                    placeholder="Pick an image of your product"
                    required
                    mt="md"
                    value={file}
                    onChange={(value) => {
                      if (value) {
                        setFileUrl(URL.createObjectURL(value));
                        setFile(value);
                      }
                    }}
                  />
                  <Group mt="md">
                    <Image src={fileUrl} height={400} width={400} alt={""} />
                  </Group>
                </Paper>
                <Paper ml={40}>
                  <TextInput
                    placeholder="What is your product's name?"
                    label="Name of the product"
                    radius="md"
                    withAsterisk
                    value={nameProduct}
                    className={classes.textInput}
                    onChange={(value) =>
                      setNameProduct(value.currentTarget.value)
                    }
                    error={emptyName}
                  ></TextInput>
                  {emptyName ? (
                    <Text fz="xs" c="red">
                      Name is required
                    </Text>
                  ) : (
                    <></>
                  )}
                  <Textarea
                    placeholder="Description of your product"
                    label="Description"
                    radius="md"
                    mt="md"
                    withAsterisk
                    value={description}
                    onChange={(value) =>
                      setDescription(value.currentTarget.value)
                    }
                    error={emptyDescription}
                  ></Textarea>
                  {emptyDescription ? (
                    <Text fz="xs" c="red">
                      Description is required
                    </Text>
                  ) : (
                    <></>
                  )}
                  <Select
                    label="Your product type"
                    placeholder="Pick one"
                    required
                    searchable
                    nothingFound="No options"
                    mt="md"
                    error={emptyType}
                    data={typeProduct}
                    value={typeChosen}
                    onChange={(value) => setTypeChosen(value!)}
                  />
                  {emptyType ? (
                    <Text fz="xs" c="red">
                      Product Type is required
                    </Text>
                  ) : (
                    <></>
                  )}
                  <NumberInput
                    label="Price"
                    radius="md"
                    mt="md"
                    withAsterisk
                    defaultValue={Number(price)}
                    precision={2}
                    min={0}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                    onChange={(value) => setPrice(value!)}
                    formatter={(value) =>
                      !Number.isNaN(parseFloat(value!))
                        ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "$ "
                    }
                    error={emptyPrice}
                  ></NumberInput>
                  {emptyPrice ? (
                    <Text fz="xs" c="red">
                      Price must higher than 0
                    </Text>
                  ) : (
                    <></>
                  )}
                </Paper>
              </Group>

              <Button fullWidth onClick={editProduct} loading={loading}>
                Edit Product
              </Button>
            </Paper>
          </Modal>
        </Paper>
      </Group>
    </div>
  );
}

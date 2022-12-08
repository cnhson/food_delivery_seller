import {
  Button,
  createStyles,
  FileInput,
  Group,
  NumberInput,
  Paper,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import image from "../../public/default-thumbnail.jpg";
import axios from "axios";
import { client } from "../../components/common";

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

type TypeProduct = {
  value: string;
  label: string;
};

type InsertProduct = {
  store_id: string;
  name: string;
  description: string;
  type_id: string;
  image: string;
  price: string;
};

export default function NewProduct() {
  const { classes } = useStyles();
  const [emptyImage, setEmptyImage] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<any>(image);
  const [typeChosen, setTypeChosen] = useState<string>("");

  // product info
  const [nameProduct, setNameProduct] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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

  const store_id = sessionStorage.getItem("Store");

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

  useEffect(() => {
    if (sessionStorage.length > 0) {
      getAllProductType();
    }
  }, []);

  async function createProduct() {
    setLoading(true);
    if (
      nameProduct === "" ||
      description === "" ||
      price === 0 ||
      file === null ||
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

      // check if file is empty
      if (file === null) {
        setEmptyImage(true);
      } else {
        setEmptyImage(false);
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
    setEmptyImage(false);
    setEmptyType(false);

    //save image into ipfs
    const fileAdded = await client.add(file);
    const data: InsertProduct = {
      store_id: store_id!,
      name: nameProduct,
      description: description,
      type_id: typeChosen,
      image: fileAdded.path,
      price: price.toString(),
    };

    try {
      const response = await axios.post(
        process.env.API + "menu/new-product",
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
            CREATE NEW PRODUCT
          </Text>
          <Group position="apart" mb={50}>
            <Paper>
              <FileInput
                label="Your product's image"
                placeholder="Pick an image of your product"
                required
                mt="md"
                error={emptyImage}
                value={file}
                onChange={(value) => {
                  if (value) {
                    setFileUrl(URL.createObjectURL(value));
                    setFile(value);
                  }
                }}
              />
              {emptyImage ? (
                <Text fz="xs" c="red">
                  Image is required
                </Text>
              ) : (
                <></>
              )}
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
                className={classes.textInput}
                onChange={(value) => setNameProduct(value.currentTarget.value)}
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
                onChange={(value) => setDescription(value.currentTarget.value)}
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
                defaultValue={0}
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

          <Button fullWidth onClick={createProduct} loading={loading}>
            Create New Product
          </Button>
        </Paper>
      </Group>
    </div>
  );
}

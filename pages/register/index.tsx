import {
  TextInput,
  PasswordInput,
  Checkbox,
  Select,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Textarea,
  createStyles,
  FileInput,
} from "@mantine/core";
import { IconAt } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import image from "../../public/default-thumbnail.jpg";
import { create } from "ipfs-http-client";
import { useRouter } from "next/router";

const projectId = process.env.PROJECT_ID;
const projectKey = process.env.SECRET_KEY;

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
  id: string;
  role_id: string;
  name: string;
  email: string;
  password: string;
  timestamp: string;
};

type TypeInsertStore = {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  type_id: string;
  timestamp: string;
};

type TypeStore = {
  value: string;
  label: string;
};

export default function Register() {
  const { classes } = useStyles();

  // field of data
  const [name, setName] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPass, setRepeatPass] = useState<string>("");
  const [match, setMatch] = useState<boolean>(true);
  const [emptyName, setEmptyName] = useState<boolean>(false);
  const [emptyStoreName, setEmptyStoreName] = useState<boolean>(false);
  const [emptyAddress, setEmptyAddress] = useState<boolean>(false);
  const [emptyDescription, setEmptyDescription] = useState<boolean>(false);
  const [emptyImage, setEmptyImage] = useState<boolean>(false);
  const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
  const [emptyType, setEmptyType] = useState<boolean>(false);
  const [emptyPassword, setEmptyPassword] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<any>(image);
  const [typeStore, setTypeStore] = useState<Array<TypeStore>>([]);
  const [typeChosen, setTypeChosen] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");

  const router = useRouter();

  // get a random key
  function genRandonString() {
    let chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charLength = chars.length;
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }

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
    const timestamp = new Date().toISOString();
    const account_id = genRandonString();

    const data: TypeInsertAccount = {
      id: account_id,
      role_id: "SEL",
      name: name,
      email: email,
      password: password,
      timestamp: timestamp,
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
        setCreated(true);
        setAccountId(account_id);
      }
    } catch (err) {
      // @ts-ignore
      alert(err.response.data.error);
    }
  }

  async function RegisterStore() {
    // check all fields
    if (
      storeName === "" ||
      address === "" ||
      description === "" ||
      file === null ||
      typeChosen === ""
    ) {
      if (storeName === "") {
        setEmptyStoreName(true);
      } else {
        setEmptyStoreName(false);
      }
      if (address === "") {
        setEmptyAddress(true);
      } else {
        setEmptyAddress(false);
      }
      if (description === "") {
        setEmptyDescription(true);
      } else {
        setEmptyDescription(false);
      }
      if (file === null) {
        setEmptyImage(true);
      } else {
        setEmptyImage(false);
      }
      if (typeChosen === "") {
        setEmptyType(true);
      } else {
        setEmptyType(false);
      }
      return;
    }

    setEmptyStoreName(false);
    setEmptyAddress(false);
    setEmptyDescription(false);
    setEmptyImage(false);
    setEmptyType(false);

    const storeId = genRandonString();
    const timestamp = new Date().toISOString();

    // create connection with ipfs
    const auth =
      "Basic " + Buffer.from(projectId + ":" + projectKey).toString("base64");
    // Create connection to IPFS using infura
    const client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    // Send image into IPFS
    const fileAdded = await client.add(file);
    console.log(fileAdded.path);

    // Fetch api to create store
    try {
      const data: TypeInsertStore = {
        id: storeId,
        owner_id: accountId,
        name: storeName,
        address: address,
        description: description,
        image: fileAdded.path,
        type_id: typeChosen,
        timestamp: timestamp,
      };

      const response = await axios.post(process.env.API + "store/create", data);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert(response.data.message);
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function selectStoreType() {
    const response = await axios.get(process.env.API + "store/get-all-type");
    const types = response.data;
    let typeArray: Array<TypeStore> = [];

    for (let i = 0; i < types.length; i++) {
      let data: TypeStore = {
        value: "",
        label: "",
      };
      data.value = types[i].id;
      data.label = types[i].name;

      typeArray.push(data);
    }

    setTypeStore(typeArray);
  }

  useEffect(() => {
    selectStoreType();
  }, []);

  return (
    <Group position="center" className={classes.wrapper}>
      {!created ? (
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
            <Text fz={13} align="center">
              First You Need To Create An Seller Account
            </Text>
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
              Continue
            </Button>
          </Paper>
        </Container>
      ) : (
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
            <Text fz={13} align="center">
              Create Your Store!
            </Text>
            <TextInput
              label="Store name"
              placeholder="A Store"
              mt="md"
              required
              onChange={(value) => setStoreName(value.currentTarget.value)}
              error={emptyStoreName}
            />
            {emptyStoreName ? (
              <Text fz="xs" c="red">
                Store name is required
              </Text>
            ) : (
              <></>
            )}
            <TextInput
              label="Store address"
              placeholder="01 Vo Van Ngan"
              required
              mt="md"
              onChange={(value) => setAddress(value.currentTarget.value)}
              error={emptyAddress}
            />
            {emptyAddress ? (
              <Text fz="xs" c="red">
                Address is required
              </Text>
            ) : (
              <></>
            )}
            <Textarea
              label="Decription"
              placeholder="Your store Description"
              required
              mt="md"
              onChange={(value) => setDescription(value.currentTarget.value)}
              error={emptyDescription}
            />
            {emptyDescription ? (
              <Text fz="xs" c="red">
                Description is required
              </Text>
            ) : (
              <></>
            )}
            <Select
              label="Your store type"
              placeholder="Pick one"
              required
              searchable
              nothingFound="No options"
              mt="md"
              error={emptyType}
              data={typeStore}
              value={typeChosen}
              onChange={(value) => setTypeChosen(value!)}
            />
            {emptyType ? (
              <Text fz="xs" c="red">
                Store Type is required
              </Text>
            ) : (
              <></>
            )}
            <FileInput
              label="Your store's image"
              placeholder="Pick an image of your store"
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
              <Image src={fileUrl} height={300} width={300} alt={""} />
            </Group>

            <Button fullWidth mt="xs" onClick={RegisterStore}>
              Create Store
            </Button>
          </Paper>
        </Container>
      )}
    </Group>
  );
}

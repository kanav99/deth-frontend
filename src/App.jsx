import * as React from "react";
import Web3 from "web3";
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Input,
  Textarea,
  Button,
  Text,
  HStack,
  Heading,
  SimpleGrid,
  Code,
  Link as ChakraLink,
  Img,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Routes as Switch, Route, Link } from "react-router-dom";
import { Logo } from "./Logo";
import code1 from "./code1.png";
import code2 from "./code2.png";
import document1 from "./documents.png";
import regex from "./regex.svg";
import {
  FcElectricity,
  FcCommandLine,
  FcMindMap,
  FcProcess,
} from "react-icons/fc";
import { Stack, useColorModeValue as mode } from "@chakra-ui/react";

const api_url = "https://api.deth.kanavgupta.xyz";

export const Feature = (props) => {
  const { title, children, icon } = props;
  return (
    <Stack
      spacing={{ base: "3", md: "6" }}
      direction={{ base: "column", md: "row" }}
    >
      <Box fontSize="6xl">{icon}</Box>
      <Stack spacing="1">
        <Text fontWeight="extrabold" fontSize="lg">
          {title}
        </Text>
        <Box color={mode("gray.600", "gray.400")}>{children}</Box>
      </Stack>
    </Stack>
  );
};

const ContractAdder = () => (
  <VStack spacing={8}>
    <FormControl isRequired>
      <FormLabel htmlFor="doc">Documentation</FormLabel>
      <Textarea
        id="doc"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
    </FormControl>
    <FormControl isRequired>
      <FormLabel htmlFor="abi">ABI</FormLabel>
      <Textarea
        id="abi"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
    </FormControl>
    <FormControl isRequired>
      <FormLabel htmlFor="contract">Contract Address</FormLabel>
      <Input id="contract" />
    </FormControl>
    <Button
      type="submit"
      onClick={async () => {
        const currentProvider = window.ethereum;
        const accounts = await currentProvider.request({
          method: "eth_requestAccounts",
        });
        const web3 = new Web3(currentProvider);
        web3.eth.sign(
          accounts[0],
          web3.sha3("test"),
          async function (_err, signature) {
            console.log(signature); // But maybe do some error checking. :-)
            const res = await fetch(`${api_url}/contract`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                signature,
                abi: JSON.parse(document.getElementById("abi").value),
                doc: JSON.parse(document.getElementById("doc").value),
                address: document.getElementById("contract").value,
              }),
            }).then((res) => res.json());
            console.log(res);
          }
        );
      }}
    >
      Sign and Submit
    </Button>
  </VStack>
);

const Demo = () => {
  const [dialogue, setDialogue] = React.useState(null);
  return (
    <VStack spacing={8} paddingX={100} paddingBottom={50}>
      <HStack spacing={39}>
        <Logo width={100} />
        <Heading fontSize={80}>deth</Heading>
      </HStack>
      <Text mt="4" fontSize="xl">
        deth is a low-maintainence API solution to transaction hex to natural
        language conversion
      </Text>
      <Box
        as="section"
        maxW="5xl"
        mx="auto"
        py="12"
        px={{ base: "6", md: "8" }}
      >
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacingX="10"
          spacingY={{ base: "8", md: "14" }}
        >
          <Feature title="Simple and Expressive API" icon={<FcCommandLine />}>
            deth provides a simple API to convert transaction hex to natural
            language prompt. Not just the natural language prompt, it also
            returns additional values useful to developers.
          </Feature>
          <Feature title="3-Step Conversion Process" icon={<FcProcess />}>
            deth tries to convert the hex to natural language in three steps -
            it moves to the next step only when the first fails.
          </Feature>
          <Feature title="Fast" icon={<FcElectricity />}>
            deth internally caches requests resulting in reduced calls to
            external vendors like Infura.
          </Feature>
          <Feature title="Learns as it goes" icon={<FcMindMap />}>
            With each query deth recieves, it learns some properties about the
            contracts involved in the transaction - leading to accurate results
            in the future.
          </Feature>
        </SimpleGrid>
      </Box>
      <Heading fontSize={"5xl"}>Try deth now!</Heading>
      <HStack width="100%">
        <FormLabel width="full" htmlFor="hex" fontSize={"2xl"}>
          Transaction Hex
        </FormLabel>
        <FormLabel width="full" htmlFor="prompt" fontSize={"2xl"}>
          Result
        </FormLabel>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Textarea
          height={150}
          id="hex"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
          }}
          defaultValue="f869038502540be40082c35094646f7e571a2d2ae709bcb9f7f12c6e47f235fd9c80b844a9059cbb0000000000000000000000005913e2469b1f7d07f93b7cb5cdc68286865cc02f0000000000000000000000000000000000000000000000000000000000000001038080"
        />
        <Textarea height={150} id="prompt" value={dialogue} readOnly />
      </HStack>
      <Button
        type="submit"
        bg={"green.400"}
        onClick={async () => {
          const hex = document.getElementById("hex").value;
          const res = await fetch(`${api_url}/tx`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hex,
            }),
          }).then((res) => res.json());
          setDialogue(res.meta.dialogue);
        }}
      >
        Decode!
      </Button>
      <Heading fontSize={"5xl"}>How deth works?</Heading>
      <VStack spacing={70}>
        <HStack>
          <Box width={"full"}>
            <Text>
              Smart-Contract developers write the <Code>@notice</Code>{" "}
              annotation to public methods using our special function to help
              them write documentation which doubles up as dialogue for the API.
            </Text>
          </Box>
          <Box width={"full"}>
            <Img src={code1} />
          </Box>
        </HStack>
        <HStack>
          <Box width={"full"}>
            <Img src={code2} />
          </Box>
          <Box width={"full"}>
            Smart-Contract Developers generate ABI and Documentation and upload
            it to the <ChakraLink href="/admin">deth's upload tool</ChakraLink>{" "}
            (currently limited to deth admins). deth save's these files as a
            reference for queries by end users.
          </Box>
        </HStack>
        <HStack>
          <Box width={"full"}>
            When a user makes a query with a hex, deth first tries to find a
            suitable ABI and Documentation. If it finds one, it uses the
            respective <Code>@notice</Code> annotation to convert the hex to
            natural language.
          </Box>
          <HStack width={"full"} justify="space-around">
            <Img src={document1} width={200} />
          </HStack>
        </HStack>
        <HStack>
          <HStack width={"full"} justify="space-around">
            <Img src={regex} width={200} />
          </HStack>
          <Box width={"full"}>
            If no documentation is found, it tries to form the prompt using
            pre-defined rules for some common transaction patters like ERC20,
            ERC721.
          </Box>
        </HStack>
        <HStack>
          <Box width={"full"}>
            If no such pattern is found, in the end it uses NLP to convert the
            function signature to a suitable prompt. This step is work in
            progress and is error prone.
          </Box>
          <HStack width={"full"} justify="space-around">
            <FcMindMap fontSize={200} />
          </HStack>
        </HStack>
      </VStack>
      <Heading fontSize={"5xl"}>How deth learns?</Heading>
      <HStack>
        <Box width={"full"}>
          <Text>
            Consider the smart contract shown beside. It exchanges some token
            for other. Now since <Code>t1</Code> and <Code>t2</Code> are
            addresses to tokens, when someone makes a query for such a
            transaction, deth learns that <Code>t1</Code> and <Code>t2</Code>{" "}
            are tokens and adds it to the list of pattern matching rules. Due to
            this, we get a double advantage - we are completely accurate that
            further queries for these tokens will be accurate and we cache the
            token metadata like symbol from Infura.
          </Text>
        </Box>
        <Box width={"full"}>
          <Img src={code1} />
        </Box>
      </HStack>
      <Link to="/admin">Admin? Add a new contract here</Link>
    </VStack>
  );
};

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <Switch>
          <Route path="/admin" element={<ContractAdder />}></Route>
          <Route path="/" element={<Demo />}></Route>
        </Switch>
      </Grid>
    </Box>
  </ChakraProvider>
);

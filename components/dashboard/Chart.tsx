import * as React from "react";
import * as ReactDom from "react-dom";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { createStyles, Paper } from "@mantine/core";
import axios from "axios";

type TypeOfData = Array<
  | number
  | [number | string, number | null]
  | null
  | Highcharts.PointOptionsObject
>;

export default function App(props: HighchartsReact.Props) {
  const [data, setData] = React.useState<TypeOfData>();

  const getData = async () => {
    const response = await axios.get(
      "https://api.casperstats.io/info/get-blockchain-data?type=deploy_tx"
    );
    //setData(response.data);
    setData(response.data);
  };

  React.useEffect(() => {
    getData();
  }, []);

  // Chart options
  const options: Highcharts.Options = {
    title: {
      text: "Total Daily Balance",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#748FFC"],
            [1, "rgba(255,255,255,0)"],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    series: [
      {
        type: "area",
        name: "Total Balance (VND): ",
        data: data,
      },
    ],
  };
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);

  return (
    <Paper
      withBorder
      p="lg"
      radius="md"
      mt={10}
      mb={10}
      shadow="0 0 35px rgb(127 150 174 / 15%);"
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        {...props}
      />
    </Paper>
  );
}

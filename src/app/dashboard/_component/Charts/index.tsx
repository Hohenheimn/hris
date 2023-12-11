import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  InteractionItem,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Bar,
  Pie,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";
import { IoIosMenu } from "react-icons/io";
import { useReactToPrint } from "react-to-print";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type PropsType = {
  chartData: {
    labels: string[];
    datasets: {
      id: number[];
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  type: "bar" | "pie";
  options: any;
  chartName: string;
};

const ChartComponent = ({ chartData, type, options, chartName }: PropsType) => {
  const [menu, setMenu] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [data, setData] = useState<any>({
    labels: [],
    datasets: [],
  });
  useEffect(() => {
    setData(chartData);
  }, [chartData]);

  const chartRef: any = useRef(null);

  const printRef: any = useRef(null);

  const printDatasetAtEvent = (dataset: InteractionItem[]) => {
    if (!dataset.length) return;
    const datasetIndex = dataset[0].datasetIndex;
    console.log(data.datasets[datasetIndex].label);
  };
  const printElementsAtEvent = (elements: InteractionItem[]) => {
    if (!elements.length) return;
    console.log(elements.length);
  };
  const printElementAtEvent = (element: InteractionItem[]) => {
    if (!element.length) return;
    const { datasetIndex, index } = element[0];
    console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
  };

  const onClickHandler = (event: any) => {
    const { current: chart } = chartRef;
    if (!chart) {
      return;
    }
    printDatasetAtEvent(getDatasetAtEvent(chart, event));
    printElementAtEvent(getElementAtEvent(chart, event));
    printElementsAtEvent(getElementsAtEvent(chart, event));
  };

  const downloadChartHandler = (name: string, fileType: string) => {
    const link = document.createElement("a");
    link.download = `${name}.${fileType}`;
    link.href = chartRef.current?.toBase64Image();
    link.click();
  };

  const plugins: any = [ChartDataLabels];

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <div className=" w-full flex justify-end relative">
        <button
          className=" hover:bg-gray-100 duration-150"
          onClick={() => setMenu(!menu)}
        >
          <IoIosMenu />
        </button>
        {menu && (
          <ul className=" absolute top-[110%] right-0 border bg-white-0">
            <li
              className=" p-2 hover:bg-gray-100 duration-150 cursor-pointer"
              onClick={() => setFullScreen(!fullScreen)}
            >
              View in full screen
            </li>
            <li
              className=" p-2 pb-3 border-b hover:bg-gray-100 duration-150  cursor-pointer"
              onClick={handlePrint}
            >
              Print chart
            </li>
            <li
              className=" p-2  pt-3 hover:bg-gray-100 duration-150  cursor-pointer"
              onClick={() => downloadChartHandler(chartName, "png")}
            >
              Download PNG image
            </li>
            <li
              className=" p-2 hover:bg-gray-100 duration-150  cursor-pointer"
              onClick={() => downloadChartHandler(chartName, "jpg")}
            >
              Downlaod JPEG image
            </li>
            <li
              className=" p-2 hover:bg-gray-100 duration-150  cursor-pointer"
              onClick={() => downloadChartHandler(chartName, "pdf")}
            >
              Download PDF document
            </li>
            <li
              className=" p-2 hover:bg-gray-100 duration-150  cursor-pointer"
              onClick={() => downloadChartHandler(chartName, "svg")}
            >
              Download SVG vector image
            </li>
            <li
              className=" p-2 hover:bg-gray-100 duration-150  cursor-pointer"
              onClick={() => downloadChartHandler(chartName, "csv")}
            >
              Download CSV
            </li>
          </ul>
        )}
      </div>

      {type === "bar" && (
        <div className=" w-full print:w-11/12">
          <Bar
            ref={chartRef}
            data={data}
            options={options}
            plugins={plugins}
            onClick={onClickHandler}
          />
        </div>
      )}
      {type === "pie" && (
        <div className=" flex w-full items-center justify-center">
          <div className=" w-11/12 max-w-[20rem]">
            <Pie
              ref={chartRef}
              data={data}
              options={options}
              plugins={plugins}
              onClick={onClickHandler}
            />
          </div>
        </div>
      )}

      {fullScreen && (
        <section className="fixed top-0 left-0 bg-[#00000074] z-50 h-full w-full flex justify-center items-center">
          <div className=" w-10/12 h-[90%] border bg-white-0 p-5 rounded-lg">
            {type === "bar" && (
              <Bar
                ref={chartRef}
                data={data}
                options={options}
                plugins={plugins}
                onClick={onClickHandler}
              />
            )}

            {type === "pie" && (
              <div className=" flex h-full w-full items-center justify-center">
                <div className=" w-10/12 max-w-[50rem]">
                  <Pie
                    ref={chartRef}
                    data={data}
                    options={options}
                    plugins={plugins}
                    onClick={onClickHandler}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section
        ref={printRef}
        className="flex flex-col items-center z-[-99] fixed top-0 left-0 w-full h-full bg-white-0  p-10"
      >
        <h4 className=" font-medium capitalize text-center mb-5">
          {chartName.replaceAll("-", " ")}
        </h4>
        {type === "bar" && (
          <div ref={printRef} className=" w-[50rem]">
            <Bar
              ref={chartRef}
              data={data}
              options={options}
              plugins={plugins}
              onClick={onClickHandler}
            />
          </div>
        )}
        {type === "pie" && (
          <div className="w-[30rem]" ref={printRef}>
            <Pie
              ref={chartRef}
              data={data}
              options={options}
              plugins={plugins}
              onClick={onClickHandler}
            />
          </div>
        )}
      </section>
    </>
  );
};

export default ChartComponent;
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Button, Paper, Grid } from "@mui/material";

type Props = {
  historyInversion: {
    newLabels: string[];
    newData: number[];
    price: number[];
    unit: number[];
  };
};

const BarGraphInversionHistory: React.FC<Props> = ({ historyInversion }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const startIndex = (currentPage - 1) * 3;
        const slicedData = historyInversion.newData.slice(
          startIndex,
          startIndex + 3
        );
        const slicedLabels = historyInversion.newLabels.slice(
          startIndex,
          startIndex + 3
        );
        const slicePrice = historyInversion.price.slice(
          startIndex,
          startIndex + 3
        );
        const sliceUnit = historyInversion.unit.slice(
          startIndex,
          startIndex + 3
        );
        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: slicedLabels,
            datasets: [
              {
                label: "Total invertido",
                data: slicedData,
                backgroundColor: "#edbb99",
                borderWidth: 2,
                borderColor: " #d33400",
                order: 3,
              },
              {
                label: "Valor por unidad",
                data: slicePrice,
                backgroundColor: "#a9cce3",
                borderWidth: 2,
                borderColor: "#2980b9",
                order: 2,
              },
              {
                label: "Cantidad de unidades compradas",
                data: sliceUnit,
                backgroundColor: "#abebc6",
                borderWidth: 2,
                borderColor: "#28b463 ",
                order: 1,
              },
            ],
          },
        });
      }
    }
  }, [historyInversion.newData, historyInversion.newLabels, 3, currentPage]);

  const totalPages = Math.ceil(historyInversion.newLabels.length / 3);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <Paper
      sx={{
        p: 2,
        Height: 300,
        width: 425,
        minHeight: 300,
         }}
    >
      <Grid item>
        <Grid item xs>
          <canvas style={{ width: "350px", height: "300px" }} ref={chartRef} />
          <Grid item>
            <Button
              sx={{ color: "black" }}
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              &lt;
            </Button>
            <Button
              sx={{ color: "black" }}
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              &gt;
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default BarGraphInversionHistory;

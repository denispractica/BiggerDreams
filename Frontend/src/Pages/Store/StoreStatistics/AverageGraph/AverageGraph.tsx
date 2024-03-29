import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Button, Paper, Grid } from "@mui/material";

type Props = {
  average: number[];
  finalAverage: number;
  restDays: number;
  buyDate: string;
};

const AverageGraph: React.FC<Props> = ({
  average,
  finalAverage,
  restDays,
  buyDate,
}) => {
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

        const startIndex = (currentPage - 1) * 10;
        const slicedAverage = average.slice(startIndex, startIndex + 10);

        chartInstanceRef.current = new Chart(ctx, {
          type: "line",

          data: {
            labels: average.map(() => ""),
            datasets: [
              {
                label: "Días de duración",
                data: slicedAverage,
                backgroundColor: "#e57373",
                borderWidth: 2,
                borderColor: "#b71c1c",
              },
              {
                label: "Promedio de duración",
                data: slicedAverage.map(() => finalAverage),
                backgroundColor: "#ec407a",
                borderWidth: 2,
                borderColor: "#880e4f",
              },
            ],
          },
        });
      }
    }
  }, [average, currentPage]);

  const totalPages = Math.ceil(average.length / 10);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <>
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
            <canvas
              style={{ width: "350px", height: "300px" }}
              ref={chartRef}
            />
            <p>
              {` Según el promedio de duración de este producto y la cantidad que actualmente tienes, en ${restDays} días 
              puede que se acaben, te aconsejo comprar antes del ${buyDate}`}
            </p>
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
    </>
  );
};
export default AverageGraph;

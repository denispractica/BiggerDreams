import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Button, Paper, Grid } from "@mui/material";

type Props = {
  months: string[];
  total: number[];
  profit: number[];
  investment: number[];
  payment: number[];
  tip: number[];
};

const StatisticsYear: React.FC<Props> = ({
  months,
  total,
  profit,
  investment,
  payment,
  tip,
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

        const startIndex = (currentPage - 1) * 3;
        const slicedMonths = months.slice(startIndex, startIndex + 3);
        const slicedTotal = total.slice(startIndex, startIndex + 3);
        const slicedProfit = profit.slice(startIndex, startIndex + 3);
        const slicedInvestment = investment.slice(startIndex, startIndex + 3);
        const slicedPayment = payment.slice(startIndex, startIndex + 3);
        const slicedTip = tip.slice(startIndex, startIndex + 3);

        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: slicedMonths,
            datasets: [
              {
                label: "Total",
                data: slicedTotal,
                backgroundColor: " #aed6f1",
                borderWidth: 2,
                borderColor: "#1b4f72",
                order: 5,
              },
              {
                label: "Ganancia",
                data: slicedProfit,
                backgroundColor: "#abebc6",
                borderWidth: 2,
                borderColor: "#28b463",
                order: 4,
              },
              {
                label: "Inversión",
                data: slicedInvestment,
                backgroundColor: "#f5b7b1",
                borderWidth: 2,
                borderColor: "#78281f",
                order: 3,
              },

              {
                label: "Pago",
                data: slicedPayment,
                backgroundColor: "#f9e79f",
                borderWidth: 2,
                borderColor: "#7d6608",
                order: 2,
              },

              {
                label: "Propina",
                data: slicedTip,
                backgroundColor: "#d7bde2",
                borderWidth: 2,
                borderColor: "#512e5f",
                order: 1,
              },
            ],
          },
        });
      }
    }
  }, [currentPage]);

  const totalPages = Math.ceil(months.length / 3);

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
        Height: 450,
        width: 525,
        minHeight: 450,
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
export default StatisticsYear;

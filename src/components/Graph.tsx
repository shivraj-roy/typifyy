import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
);

const Graph = ({ graphData }: { graphData: number[][] }) => {
   const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   const lineWidth = isMobile ? 1.5 : 3;
   const pointSize = isMobile ? 1 : 2.5;

   const data = {
      labels: graphData.map(([time]) => time),
      datasets: [
         {
            label: "raw",
            data: graphData.map(([, rawWpm]) => rawWpm),
            borderColor: "#eb5e2980",
            backgroundColor: "#eb5e2980",
            borderDash: [8, 8],
            borderWidth: lineWidth,
            tension: 0.3,
            pointRadius: 0,
         },
         {
            label: "wpm",
            data: graphData.map(([, , Wpm]) => Wpm),
            borderColor: "#eb5e29",
            backgroundColor: "#eb5e29",
            borderWidth: lineWidth,
            tension: 0.3,
            pointRadius: pointSize,
         },
      ],
   };

   // Calculate max WPM from both raw and net WPM to determine step size
   const maxRawWPM = Math.max(...graphData.map(([, rawWpm]) => rawWpm || 0), 0);
   const maxNetWPM = Math.max(
      ...graphData.map(([, , netWpm]) => netWpm || 0),
      0,
   );
   const maxWPM = Math.max(maxRawWPM, maxNetWPM);
   const stepSize = maxWPM <= 30 ? 10 : 20;

   const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
         mode: "index" as const,
         intersect: false,
      },
      plugins: {
         tooltip: {
            mode: "index" as const,
            intersect: false,
            bodyFont: {
               family: "'Roboto Mono', 'Space Mono', monospace",
            },
            titleFont: {
               family: "'Roboto Mono', 'Space Mono', monospace",
            },
         },
         legend: {
            display: true,
            position: "top" as const,
            align: "end" as const,
            labels: {
               font: {
                  family: "'Roboto Mono', 'Space Mono', monospace",
               },
               boxWidth: 40,
               padding: 10,
            },
         },
      },
      scales: {
         x: {
            ticks: {
               font: {
                  family: "'Roboto Mono', 'Space Mono', monospace",
               },
            },
         },
         y: {
            beginAtZero: true,
            min: 0,
            title: {
               display: true,
               text: "Words per Minute",
               font: {
                  family: "'Roboto Mono', 'Space Mono', monospace",
               },
            },
            ticks: {
               maxTicksLimit: 5,
               stepSize: stepSize,
               font: {
                  family: "'Roboto Mono', 'Space Mono', monospace",
               },
            },
         },
      },
   };

   return (
      <div className="w-full h-full">
         <Line data={data} options={options} />
      </div>
   );
};
export default Graph;

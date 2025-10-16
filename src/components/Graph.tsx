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
import { Line } from "react-chartjs-2";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

const Graph = ({ graphData }: { graphData: number[][] }) => {
   const data = {
      labels: graphData.map(([time]) => time),
      datasets: [
         {
            label: "raw",
            data: graphData.map(([, rawWpm]) => rawWpm),
            borderColor: "rgb(235, 89, 57, 0.5)",
            borderDash: [10, 10],
            tension: 0.3,
            pointRadius: 0,
         },
         {
            label: "wpm",
            data: graphData.map(([, , Wpm]) => Wpm),
            borderColor: "rgb(235, 89, 57)",
            backgroundColor: "rgb(235, 89, 57)",
            tension: 0.3,
            pointRadius: 3,
         },
      ],
   };

   // Calculate max WPM from both raw and net WPM to determine step size
   const maxRawWPM = Math.max(...graphData.map(([, rawWpm]) => rawWpm || 0), 0);
   const maxNetWPM = Math.max(
      ...graphData.map(([, , netWpm]) => netWpm || 0),
      0
   );
   const maxWPM = Math.max(maxRawWPM, maxNetWPM);
   const stepSize = maxWPM <= 30 ? 10 : 20;

   const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         y: {
            beginAtZero: true,
            ticks: {
               maxTicksLimit: 5,
               stepSize: stepSize,
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

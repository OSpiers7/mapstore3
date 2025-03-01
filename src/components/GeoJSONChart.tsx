import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FeatureCollection } from 'geojson';

interface GeoJSONChartProps {
  data: FeatureCollection;
  xAttr: string;
  yAttr: string;
}

const GeoJSONChart: React.FC<GeoJSONChartProps> = ({ data, xAttr, yAttr }) => {
  if (!xAttr || !yAttr) return <p>Please select chart attributes to generate chart.</p>;

  try {
    const labels: string[] = [];
    const values: number[] = [];

    const counts: Record<string, number> = {};

    data.features.forEach((feature) => {
      const xValue = feature.properties?.[xAttr];
      if (xValue !== undefined) {
        counts[xValue] = (counts[xValue] || 0) + 1;
      }
    });

    Object.keys(counts).forEach((key) => {
      labels.push(key);
      values.push(counts[key]);
    });

    const chartData = {
      labels,
      datasets: [
        {
          label: `${xAttr} vs ${yAttr}`,
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };

    return <Bar data={chartData} />;
  } catch (error) {
    console.error('Error generating chart:', error);
    return <p>An error occurred while generating the chart. Please try again.</p>;
  }
};

export default GeoJSONChart;

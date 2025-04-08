'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import * as d3 from 'd3';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);

const DataVisualization = () => {
  const [activeTab, setActiveTab] = useState<'chart' | 'd3'>('chart');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'radar'>('line');
  const [animateData, setAnimateData] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Sample data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const [lineData, setLineData] = useState({
    labels: months,
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90, 85, 72, 60, 40, 30],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        tension: 0.4,
      },
    ],
  });
  
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90, 85, 72, 60, 40, 30],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
      },
    ],
  };
  
  const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Dataset',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const radarData = {
    labels: ['Speed', 'Power', 'Strength', 'Agility', 'Endurance', 'Flexibility'],
    datasets: [
      {
        label: 'Athlete 1',
        data: [85, 70, 75, 80, 60, 90],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'Athlete 2',
        data: [70, 85, 80, 65, 90, 75],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      },
    ],
  };
  
  // D3 visualization
  useEffect(() => {
    if (activeTab === 'd3' && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      
      // Sample data
      const data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
        { name: 'C', value: 30 },
        { name: 'D', value: 25 },
        { name: 'E', value: 15 },
        { name: 'F', value: 35 },
        { name: 'G', value: 28 },
      ];
      
      // Scales
      const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, innerWidth])
        .padding(0.1);
      
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .nice()
        .range([innerHeight, 0]);
      
      // Create group element
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Add axes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'middle')
        .attr('fill', 'currentColor');
      
      g.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .attr('fill', 'currentColor');
      
      // Add bars with animation
      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.name) || 0)
        .attr('y', innerHeight)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('fill', (_, i) => d3.interpolateBlues(i / data.length + 0.3))
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100)
        .attr('y', d => y(d.value))
        .attr('height', d => innerHeight - y(d.value));
      
      // Add labels
      g.selectAll('.value')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'value')
        .attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .text(d => d.value)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100 + 500)
        .style('opacity', 1);
    }
  }, [activeTab]);
  
  // Animate chart data
  useEffect(() => {
    if (animateData) {
      const interval = setInterval(() => {
        setLineData(prev => ({
          ...prev,
          datasets: prev.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(() => Math.floor(Math.random() * 100))
          }))
        }));
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [animateData]);
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <motion.button
            className={`px-4 py-2 rounded-full ${
              activeTab === 'chart' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('chart')}
          >
            Chart.js
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-full ${
              activeTab === 'd3' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('d3')}
          >
            D3.js
          </motion.button>
        </div>
        
        {activeTab === 'chart' && (
          <div className="flex flex-wrap gap-2">
            <motion.button
              className={`px-3 py-1 rounded-full text-sm ${
                chartType === 'line' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChartType('line')}
            >
              Line
            </motion.button>
            <motion.button
              className={`px-3 py-1 rounded-full text-sm ${
                chartType === 'bar' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChartType('bar')}
            >
              Bar
            </motion.button>
            <motion.button
              className={`px-3 py-1 rounded-full text-sm ${
                chartType === 'pie' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChartType('pie')}
            >
              Pie
            </motion.button>
            <motion.button
              className={`px-3 py-1 rounded-full text-sm ${
                chartType === 'radar' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChartType('radar')}
            >
              Radar
            </motion.button>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-inner p-4 h-[400px] flex items-center justify-center">
        {activeTab === 'chart' ? (
          <div className="w-full h-full">
            {chartType === 'line' && <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />}
            {chartType === 'bar' && <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />}
            {chartType === 'pie' && <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />}
            {chartType === 'radar' && <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false }} />}
          </div>
        ) : (
          <svg ref={svgRef} width="100%" height="100%" />
        )}
      </div>
      
      {activeTab === 'chart' && (
        <div className="mt-4 flex justify-center">
          <motion.button
            className={`px-4 py-2 rounded-full ${
              animateData 
                ? 'bg-danger text-white' 
                : 'bg-success text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAnimateData(!animateData)}
          >
            {animateData ? 'Stop Animation' : 'Animate Data'}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default DataVisualization;

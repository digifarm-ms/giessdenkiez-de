import React, { useState, useEffect } from "react";
import styled from "styled-components";

const LineChartWrapper = styled.div`
  width: 100%;
  height: 100px;
  margin: 5px 0;
`;

import {
  select as d3Select,
  scaleLinear,
  area as d3Area,
  line as d3Line,
  scaleTime as d3ScaleTime,
  path as d3Path,
  transition as d3Transition,
  easeCubicInOut,
  select,
  axisLeft,
  axisBottom
} from "d3";

const Linechart = p => {
  const { data } = p;
  const [scaleTime, setScaleTime] = useState(null);
  const [scaleRain, setScaleRain] = useState(null);

  const margin = {
    top: 10,
    right: 5,
    bottom: 30,
    left: 20
  };

  let svg = null;
  let width = null;
  let height = null;
  let xAxis = null;
  let yAxis = null;
  let line = null;
  let area = null;
  let lineShape = null;
  let areaShape = null;

  useEffect(() => {
    const transformedData = transformData(data);
    init(transformedData);
  }, [])

  const transformData = d => {
    let sumPerDay = 0;

    let hours = [];

    // aggregate hours to days
    d.forEach((hour,i) => {
      sumPerDay += hour;
      const fullDay = (i % 24) === 23;
      if (fullDay) {
        const sum = sumPerDay;
        sumPerDay = 0;
        hours.push(sum);
      }
    })

    return hours;
  }

  const init = data => {
    const wrapper = select("#linechart");
    width = wrapper.node().clientWidth;
    height = wrapper.node().clientHeight;

    svg = wrapper
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const today = new Date()
    const priorDate = new Date().setDate(today.getDate()-30)

    const scaleTime = scaleLinear()
      .domain([30,0]) // @TODO: check the hours of the day
      .range([0, width - margin.left - margin.right]);
    setScaleTime(() => scaleTime)

    const scaleRain = scaleLinear()
      .domain([0, 50]) // @TODO: check the hours of the day
      .range([height - margin.top - margin.bottom, 0]);
    setScaleRain(() => scaleRain)

    yAxis = axisLeft(scaleRain).ticks(1);
    xAxis = axisBottom(scaleTime).ticks(3);

// y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    // x-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(xAxis);

    area = d3Area()
      .x((d,i) => scaleTime(i))
      .y0(d => scaleRain(d))
      .y1(61)

    areaShape = svg.append("path")
      .datum(data)
      .attr("fill", "url(#linear-gradient)")
      .attr("opacity", "1")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr('id', `rain-areaShape`)
      .attr("class", "area")
      .attr("d", area)

    svg.append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", scaleRain(40))
      .attr("x2", 0).attr("y2", scaleRain(0))
      .selectAll("stop")
      .data([
        {offset: "0%", color: "#75ADE8"},
        {offset: "100%", color: "#FFFFFF"}
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset )
      .attr("stop-color", d => d.color );

    line = d3Line()
      .x((d,i) => {return scaleTime(i)})
      .y((d,i) => {return scaleRain(d)})

    lineShape = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      // .attr('id', `-pathShape-${index}`)
      .attr("stroke", '#75ADE8')
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line)

  }

  return (
    <LineChartWrapper id="linechart">
    </LineChartWrapper>
  )
}

export default Linechart;
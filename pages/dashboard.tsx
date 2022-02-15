import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ErrorData, FixedHeightGrid, SearchButton, TentSpinner } from "../components";
import { DashboardLayout } from "../layout";
import styled from "styled-components";
import { TentCard } from "../components/card";
import { Bar } from "react-chartjs-2";
import {  Chart, ChartType, ChartOptions} from 'chart.js';
import { WithAuth } from "../HOC";
import { useGetDashboardDataQuery } from "../services";
import moment from "moment";





const clickSearchButton = () => {
  console.log("clicked");
};


// const options:ChartOptions = {
//   scales: {
//     yAxes: [
//       {
//         stacked: true,
//         ticks: {
//           beginAtZero: true,
//         },
//       },
//     ],
//     xAxes: [
//       {
//         stacked: true,
//       },
//     ],
//   },
// };

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};


export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Dashboard = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const lg = useMediaQuery(theme.breakpoints.up('lg'));

  const today = new Date().toISOString().split('T')[0];
  const tenDaysBefore = moment()
    .subtract(20, 'd') //replace 2 with number of days you want to add
    .format('YYYY-MM-DD');

  console.log(tenDaysBefore);


  const [startDate, setStartDate] = useState(tenDaysBefore);
  const [endDate, setEndDate] = useState(today);

  const { refetch, data, isLoading: loading, error: cardError } = useGetDashboardDataQuery({ end: endDate, start: startDate }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  })

  // console.log(data.data.data);

  let mapData;

  if(!loading && !cardError && data.data) {
    mapData = {
      labels: data.data.data.userChart.labels,
      datasets: [
        {
          label: "Registrations",
          data: data.data.data.userChart.registration,
          backgroundColor: "#EACA1F",
        },
        {
          label: "Verification",
          data: data.data.data.userChart.verification,
          backgroundColor: "#161616",
        },
      ],
    }
  }

  const VerticalBar = () => <Bar height={100} data={mapData} options={options} />;


  useEffect(() => {
    refetch()
  }, [endDate, startDate])

  const DashContainer = styled.div`
  padding: 10px;
  height: ${matches ? " calc(100% - 60px)" : " calc(100% - 119)"};
`;

  return (
    <DashboardLayout title={<Typography variant="h4">Overview</Typography>} action={<SearchButton onclick={clickSearchButton} text="Live/Default" />}>
      {loading ? <TentSpinner /> : cardError ? <ErrorData error={cardError} /> : (
        <Stack height="100%" rowGap={2} alignItems="stretch">
          <Grid justifyContent="stretch" container spacing={3}>
            <Grid lg={4} md={12} sm={12} xs={12} item>
              <TentCard rounded>
                <CardHeader title="User Status" />
                <CardContent
                  sx={{
                    justifyContent: "flex-end",
                    display: "flex",
                    flexDirection: "column",
                    height: "80%",
                  }}
                >
                  <Stack spacing={2}>
                    <ListItem>
                      <Typography variant="body1">Total Users</Typography>
                      <Typography variant="h6">{data.data.data.userStatus.totalUsers}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body1">Total Verified Users</Typography>
                      <Typography variant="h6">{data.data.data.userStatus.totalVerifiedUsers}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body1">Avg. New Users</Typography>
                      <Typography variant="h6">{data.data.data.userStatus.avgNewUsers}</Typography>
                    </ListItem>
                  </Stack>
                </CardContent>
              </TentCard>
            </Grid>
            <Grid lg={8} md={12} sm={12} xs={12} item>
              <TentCard rounded>{VerticalBar()}</TentCard>
            </Grid>
          </Grid>

          <Grid  justifyContent="stretch" container spacing={3}>
            <Grid lg={4} md={12} sm={12} xs={12} item>
              <TentCard rounded>
                <CardHeader title="Order Status" />
                <CardContent
                  sx={{
                    justifyContent: "flex-end",
                    display: "flex",
                    flexDirection: "column",
                    height: "80%",
                  }}
                >
                  <Stack spacing={2}>
                    <ListItem>
                      <Typography variant="body1">Total Orders</Typography>
                      <Typography variant="h6">{data.data.data.orderStatus.totalOrders}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body1">Pending Orders</Typography>
                      <Typography variant="h6">{data.data.data.orderStatus.totalPendingOrders}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body1">Closed Orders</Typography>
                      <Typography variant="h6">{data.data.data.orderStatus.totalCanceledOrders}</Typography>
                    </ListItem>
                  </Stack>
                </CardContent>
              </TentCard>
            </Grid>
            <Grid lg={4} md={12} sm={12} xs={12} item>
              <TentCard rounded>
                <CardHeader title="Sales Status" />
                <CardContent
                  sx={{
                    justifyContent: "flex-end",
                    display: "flex",
                    flexDirection: "column",
                    height: "80%",
                  }}
                >
                  <Stack spacing={2}>
                    <ListItem>
                      <Typography variant="body1">Total Sales</Typography>
                      <Typography variant="h6">{data.data.data.salesStatus.totalSales}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body1">Land Sale</Typography>
                      <Typography variant="h6">{data.data.data.salesStatus.landSales}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body1">Building Sale</Typography>
                      <Typography variant="h6">{data.data.data.salesStatus.buildingSales}</Typography>
                    </ListItem>
                  </Stack>
                </CardContent>
              </TentCard>
            </Grid>
            <Grid lg={4} md={12} sm={12} xs={12} item>
              <TentCard rounded>
                <CardHeader title="User Status" />
                <CardContent
                  sx={{
                    justifyContent: "flex-end",
                    display: "flex",
                    flexDirection: "column",
                    height: "80%",
                    overflow:"auto"
                  }}
                >
                  <Stack spacing={2}>
                    <ListItem>
                      <Typography variant="h6">Location</Typography>
                      <Typography variant="h6">Unit Sold</Typography>
                    </ListItem>
                    {data.data.data.topSelling.map((item, index) => (
                        <ListItem key={index}>
                          <Typography variant="body1">{item.location}</Typography>
                          <Typography variant="body1">{item.unitSold}</Typography>
                        </ListItem>
                      ))}
                   
                  </Stack>
                </CardContent>
              </TentCard>
            </Grid>
          </Grid>
        </Stack>)}
    </DashboardLayout>
  );
};

export default WithAuth(Dashboard);

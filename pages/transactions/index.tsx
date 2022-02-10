import { CardContent, CardHeader, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { FixedHeightGrid, TentCard } from '../../components';
import { DashboardLayout } from '../../layout';
import { useGetPaymentGraphMutation, useGetPaymentSummaryQuery, useGetTransactionsQuery } from '../../services';
import { ListItem } from '../dashboard';


const today = new Date().toISOString().split('T')[0];
const tenDaysBefore = moment()
    .subtract(20, 'd') //replace 2 with number of days you want to add
    .format('YYYY-MM-DD');

console.log(tenDaysBefore);

const Transactions = () => {
    const [startDate, setStartDate] = useState(tenDaysBefore);
    const [endDate, setEndDate] = useState(today);
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useGetTransactionsQuery({ pageNumber: page }, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
    });

    const { data: data2, isLoading: isLoading2, error: error2, isError: isError2 } = useGetPaymentSummaryQuery('', {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
    });

    const [getPaymentGraph, { isLoading: isLoading3, isError: isError3, data:data3 }] = useGetPaymentGraphMutation();


    useEffect(() => {
        getPaymentGraph({start: startDate,end: endDate});
    }, [startDate, endDate]);
    

    let newData = [];

    if (data && !isLoading && !error) {
        newData = data.data.payments.map(transaction => {
            return {
                createdAt: transaction.createdAt,
                orderID: transaction.order.orderId,
                fullName: transaction.user.fullName,
                userID: transaction.user._id,
                amount: transaction.amount,
                transRef: transaction.flw_ref,

            }
        })
    }

    let mapData = {
        labels: [],
        datasets: [
            {
                label: "Completed Payments",
                data: [],
                backgroundColor: "#EACA1F",
            },
            {
                label: "Incomplete Payments",
                data: [],
                backgroundColor: "#161616",
            },
        ],
    }

    if (data3 && !isLoading3 && !isError3) {
        
     mapData = {
        labels: data3.data.labels,
        datasets: [
            {
                label: "Completed Payments",
                data: data3.data.completedPayments,
                backgroundColor: "#EACA1F",
            },
            {
                label: "Incomplete Payments",
                data: data3.data.incompletePayments,
                backgroundColor: "#161616",
            },
        ],
    }
}


    const columns: MUIDataTableColumnDef[] = [
        { name: "createdAt", label: "Date Created", options: { filter: true, sort: true } },
        { name: "orderID", label: "Order ID" },
        { name: "fullName", label: "Full Name" },
        { name: "userID", label: "User ID" },
        { name: "amount", label: "Amount" },
        { name: "transRef", label: "Transaction Ref" },
    ]

    const options: MUIDataTableOptions = {
        search: true,
        download: true,
        print: true,
        viewColumns: true,
        filter: true,
        filterType: "dropdown",
        responsive: "standard",
        tableBodyHeight: "400px",
        rowsPerPage: 20,
        rowsPerPageOptions: [5, 10, 20],
        serverSide: true,
        count: data ? data.data.paymentCount : 0,
        page,
        onTableChange: (action, tableState) => {
            switch (action) {
                case "changePage":
                    setPage(tableState.page);
                    break;
                default:
                    break;
            }
        },
        onRowsDelete: (rowsDeleted) => {
            console.log(rowsDeleted);
        },
        onRowClick: (rowData, rowMeta) => {
            console.log("Row clicked: ", rowData, "Row Index:", rowMeta.dataIndex);
        }
    };

    const barOption = {
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

    const VerticalBar = () => <Bar height={100} data={mapData} options={barOption} />;


    return <DashboardLayout title={<h1>Transaction dashboard</h1>}>
        <Stack height="100%" rowGap={{ md: 4, lg: 4, sm: 4, xs: 4 }} alignItems="stretch">
            <FixedHeightGrid height={50} justifyContent="stretch" container spacing={3}>
                <Grid lg={4} md={12} sm={12} xs={12} item>
                    {
                        isError2 ? <h3>Error loading data</h3> : isLoading2 ? <CircularProgress /> : (
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
                                            <Typography variant="body1">Total Payment</Typography>
                                            <Typography variant="h6">{data2.data.totalPayments}</Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography variant="body1">Avg. Sales</Typography>
                                            <Typography variant="h6">{data2.data.avgSales}</Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography variant="body1">Total Sales</Typography>
                                            <Typography variant="h6">{data2.data.totalSales}</Typography>
                                        </ListItem>
                                    </Stack>
                                </CardContent>
                            </TentCard>
                        )
                    }

                </Grid>
                <Grid lg={8} md={12} sm={12} xs={12} item>
                    <TentCard rounded>{VerticalBar()}</TentCard>
                </Grid>
            </FixedHeightGrid>

            <FixedHeightGrid height={50} justifyContent="stretch" container spacing={3}>
                <Grid lg={12} md={12} sm={12} xs={12} item sx={{ mb: "50px" }}>
                    <TentCard rounded>

                        <MUIDataTable
                            title={
                                <Typography variant="h6">
                                    {isLoading && (
                                        <CircularProgress
                                            size={24}
                                            style={{ marginLeft: 15, position: "relative", top: 4 }}
                                        />
                                    )}
                                </Typography>
                            }
                            data={newData}
                            columns={columns}
                            options={options}
                        />
                    </TentCard>
                </Grid>
            </FixedHeightGrid>

        </Stack>
    </DashboardLayout>;
};

export default Transactions;

import { Button, CircularProgress, Typography } from '@mui/material';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables';
import React, { useState } from 'react';
import { WithAuth } from '../../HOC';
import { DashboardLayout } from '../../layout';
import { useGetOrdersQuery } from '../../services';

const OrderPage = () => {

    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useGetOrdersQuery({ pageNumber: page }, {
        refetchOnMountOrArgChange: true,
    });

    let newOrder = [];

    if (data && !isLoading) {
        newOrder = data.data.orders.map(order => {
            return {
                createdAt: order.createdAt,
                fullName: order.user.fullName,
                phoneNumber: order.user.phoneNumber,
                userID: order.user._id,
                totalEstimatedPrice: order.totalEstimatedPrice,
                building: `hello`,
                status: "pending",
                orderId: order._id,
                total: order.totalEstimatedPrice,
            }
        })
    }

    const columns: MUIDataTableColumnDef[] = [
        { name: "createdAt", label: "Date Created", options: { filter: true, sort: true } },
        { name: "fullName", label: "Full Name" },
        { name: "phoneNumber", label: "Phone Number" },
        { name: "userID", label: "User ID" },
        { name: "totalEstimatedPrice", label: "Total Estimated Price" },
        { name: "building", label: "Building" },
        {
            name: "Status",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button
                            className='bg-green-500 text-white'
                            sx={{
                                width: "102.97px",
                                boxShadow: "none",
                                borderRadius: "6px",
                                fontSize: "13px",
                                padding: "5px 10px",
                                backgroundColor:
                                    value === "processing"
                                        ? "#3BEA1F"
                                        : "#EACA1F",
                            }}
                            variant="contained"
                            size="small"
                        >
                            {value}
                        </Button>
                    )
                }
            }
        },
        { name: "orderID", label: "Order ID" },
        "Total"

    ]



    const options: MUIDataTableOptions = {
        search: true,
        download: true,
        print: true,
        viewColumns: true,
        filter: true,
        filterType: "dropdown",
        responsive: "standard",
        tableBodyHeight: "100%",
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20],
        serverSide: true,
        count: data?.data.pages,
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




    };

    return <DashboardLayout title={<Typography variant="h4">Orders</Typography>}>
        <MUIDataTable
            title={
                <Typography variant="h6">
                    Order Status
                    {isLoading && (
                        <CircularProgress
                            size={24}
                            style={{ marginLeft: 15, position: "relative", top: 4 }}
                        />
                    )}
                </Typography>
            }
            data={newOrder}
            columns={columns}
            options={options}
        />
    </DashboardLayout>;
};

export default WithAuth(OrderPage);

import { Button, CircularProgress, Typography } from '@mui/material';
import moment from 'moment';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables';
import React, { useState } from 'react';
import { WithAuth } from '../../HOC';
import { DashboardLayout } from '../../layout';
import { useGetOrdersQuery } from '../../services';
import styled from "styled-components";
import { ErrorData, TentSpinner } from '../../components';


interface StatusProps {
    background: string
}

const Status = styled.div`
background: ${(props: StatusProps) => props.background};
border-radius: 154.324px;
padding: 5px 10px;
display: inline-block;
height: fit-content;
font-size: 14px;
color: #fff;
`

const OrderPage = () => {

    const [page, setPage] = useState(1);
    const { data, isLoading, error, isFetching } = useGetOrdersQuery({ pageNumber: page }, {
        refetchOnMountOrArgChange: true,
    });

    let newOrder = [];

    if (data && !isLoading) {
        newOrder = data.data.orders.map(order => {
            return {
                createdAt: order.createdAt,
                fullName: order.user.fullName,
                phoneNumber: order.user.phoneNumber,
                userID: order.user.tentUserId,
                landEstimatedPrice: Math.round(order.landEstimatedPrice),
                building: order.building,
                status: order.status,
                orderID: order._id,
                Total: order.totalEstimatedPrice,
            }
        })
    }

    console.log(newOrder);

    const columns: MUIDataTableColumnDef[] = [
        {
            name: "createdAt", label: "Date Created", options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Typography variant="body2">
                            {moment(value).format('MMMM Do YYYY')}
                        </Typography>
                    )
                }
            }
        },
        { name: "fullName", label: "Full Name" },
        { name: "phoneNumber", label: "Phone Number" },
        { name: "userID", label: "User ID" },
        { name: "landEstimatedPrice", label: "Land Estimated Price" },
        {
            name: "building",
            label: "Building",

            options: {
                customBodyRender: (value: {
                    buildingType: string
                    numberOfRoom: number
                    buildingEstimatedPrice: number
                }, tableMeta, updateValue) => {

                    if (value) {
                        return (
                            <div>
                                <Typography variant="body2">
                                    {`${value.numberOfRoom} Bedroom`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${value.buildingType}`}
                                </Typography>
                            </div>
                        )
                    } else {
                        return (
                            <Typography variant="body2">
                                No building
                            </Typography>
                        )
                    }

                }
            }
        },
        {
            name: "status",
            label: "Status",
            options: {
                customBodyRender: (value: string, tableMeta, updateValue) => {
                    return (
                        <div>
                            {
                                value.toLocaleLowerCase() == "terminate" && <Status background="red" >FAILED</Status>
                            }
                            {
                                value.toLocaleLowerCase() === "completed" && <Status background="#04C300" >COMPLETED</Status>
                            }
                            {
                                value.toLocaleLowerCase() === "processing" && <Status background="#00A3FF">PROCESSING</Status>
                            }
                        </div>
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
        rowsPerPage: 20,
        serverSide: false,
        count: data?.data.orderCount,
        page: page - 1,
        onTableChange: (action, tableState) => {
            switch (action) {
                case "changePage":
                    console.log(tableState.page);
                    
                    setPage(tableState.page +  1);
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

        {
            error ? <ErrorData error={error} /> : isLoading ? <TentSpinner /> : (
                <MUIDataTable
                    title={
                        <Typography variant="h6">
                            Order Status
                            {isFetching && (
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
            )
        }

    </DashboardLayout>;
};

export default WithAuth(OrderPage);

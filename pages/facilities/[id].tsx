import { CardHeader, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, IconButton, TablePagination, TextField, InputAdornment, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { DataCountCard, ErrorData, FixedHeightGrid, SearchButton, TentCard, TentSpinner } from '../../components'
import { WithAuth } from '../../HOC'
import { useNextQueryParam } from '../../hooks'
import { DashboardLayout } from '../../layout'
import { useGetFacilityQuery, useLazyGetFacilityQuery, SingleFacilityResponse } from '../../services'
import Delete from "remixicon-react/DeleteBinLineIcon";
import Edit from "remixicon-react/PencilLineIcon";
import View from 'remixicon-react/EyeLineIcon'
import { OrderType } from '../../lib'
import SearchIcon from '@mui/icons-material/Search';
import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables'
import moment from 'moment'
import styled from "styled-components";

const clickSearchButton = () => {
    console.log('hi');

}

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
const Facility = ({ params }: { params: ParsedUrlQuery }) => {
    const router = useRouter()
    let id: string | string[] = router.query.id;
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [formState, setFormState] = React.useState<SingleFacilityResponse>()
    const [trigger, result] = useLazyGetFacilityQuery({
        refetchOnReconnect: true,
    })

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };






    useEffect(() => {
        trigger({ id: params.id as string, estateStatusPageNumber: page })
    }, [params.id, page]);


    useEffect(() => {
        if (result.isSuccess && result.isLoading === false) {
            setFormState(result.data.data)
        }
    }, [result])

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
        count: formState ?  formState.estateStatus.statusCount : 0,
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

    const columns: MUIDataTableColumnDef[] = [
        { name: "building", label: "Added building" },
        {
            name: "dateCreated", label: "Date Created", options: {
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
        { name: "orderId", label: "Order ID" },
        { name: "orderSize", label: "Order Size" },
        { name: "phoneNumber", label: "Phone Number" },    
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
        { name: "userId", label: "User ID" },

    ]

    let newStatus = []

    if (formState && !result.isLoading) {
        newStatus = formState.estateStatus.status.map(order => {
            return {
                building: order.building ? 'added building' : 'no building',
                dateCreated: order.dateCreated,
                fullName: order.fullName,
                orderId: order.orderId,
                orderSize: order.orderSize,
                phoneNumber: order.phoneNumber,
                status: order.status,
                userId: order.userId,
            }
        })
    }




    return (
        <DashboardLayout
            title={<Typography variant="h4">Overview</Typography>}
            action={<SearchButton onclick={clickSearchButton} text="Live/Default" />}
        >
            {result.isError ? <ErrorData error={result.error} /> : result.isLoading ? <TentSpinner /> : !formState ? <p>no data</p> : (
                <Stack spacing={2} sx={{ flexGrow: 1 }}>

                    <FixedHeightGrid
                        height={20}
                        justifyContent="stretch"
                        container
                        spacing={3}
                    >
                        <Grid lg={4} md={4} sm={6} xs={12} item>
                            <DataCountCard color="#EACA1F">
                                <Typography variant="h6">{formState.summary.totalLandSize}</Typography>
                                <Typography variant="body2">Total Land Size</Typography>
                            </DataCountCard>
                        </Grid>
                        <Grid lg={4} md={4} sm={6} xs={12} item>
                            <DataCountCard color="#EACA1F">
                                <Typography variant="h6">{formState.summary.totalBuildingSold}</Typography>
                                <Typography variant="body2">Total Building Sold</Typography>
                            </DataCountCard>
                        </Grid>
                        <Grid lg={4} md={4} sm={6} xs={12} item>
                            <DataCountCard color="#EACA1F">
                                <Typography variant="h6">{formState.summary.totalUnitSold}</Typography>
                                <Typography variant="body2">Total Unit Sold</Typography>
                            </DataCountCard>
                        </Grid>
                    </FixedHeightGrid>
                    <FixedHeightGrid height={50}>
                        <TentCard>
                            <CardHeader
                                action={
                                    <Stack>
                                        <TextField
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                )

                                            }}
                                            size="small"
                                            placeholder='Search' type='search' />
                                    </Stack>
                                }
                                title={<Typography variant="h4">Estate Status</Typography>}
                            />
                            <Grid>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                    <MUIDataTable
                                        title={
                                            <Typography variant="h6">
                                                Order Status
                                                {result.isError && (
                                                    <CircularProgress
                                                        size={24}
                                                        style={{ marginLeft: 15, position: "relative", top: 4 }}
                                                    />
                                                )}
                                            </Typography>
                                        }
                                        data={newStatus}
                                        columns={columns}
                                        options={options}
                                    />
                                </Paper>
                            </Grid>
                        </TentCard>
                    </FixedHeightGrid>
                </Stack>
            )}
        </DashboardLayout>
    )
}

export default WithAuth(Facility)

export const getServerSideProps = (context: GetServerSidePropsContext) => {
    return {
        props: { params: context.params }
    };
}
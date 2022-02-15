import { CardHeader, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, IconButton, TablePagination, TextField, InputAdornment, CircularProgress, Fade, Modal, Card, CardContent, Backdrop, ListItem, ListItemText, ListItemAvatar, Avatar, CardActions } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { DataCountCard, ErrorData, FixedHeightGrid, SearchButton, TentCard, TentSpinner, TentTextField } from '../../components'
import { WithAuth } from '../../HOC'
import { useNextQueryParam } from '../../hooks'
import { DashboardLayout } from '../../layout'
import { useGetFacilityQuery, useLazyGetFacilityQuery, SingleFacilityResponse, useRemoveBuildingMutation, useAddBuildingMutation } from '../../services'

import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from 'mui-datatables'
import moment from 'moment'
import styled from "styled-components";
import Home5LineIcon from 'remixicon-react/Home5LineIcon'
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack'
import { LoadingButton } from '@mui/lab'

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
    const { enqueueSnackbar } = useSnackbar();
    let id: string | string[] = router.query.id;
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openAddBuildingForm, setOpenAddBuildingForm] = useState(false)
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [formState, setFormState] = useState<SingleFacilityResponse>()
    const [buildingForm, setBuildingForm] = useState<{ buildingType: string, numberOfRoom: number, price: number }>()
    const [trigger, result] = useLazyGetFacilityQuery({
        refetchOnReconnect: true,
    })

    const handleChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) =>
        setBuildingForm((prev) => ({ ...prev, [name]: value }))

    const [deleteBuilding, { isLoading, isError }] = useRemoveBuildingMutation()
    const [addBuilding, { isLoading: isLoadingAdd, isError: isErrorAdd }] = useAddBuildingMutation()

    const handleRemoveBuilding = async (id: string) => {

        try {
            const resp = await deleteBuilding({
                facilityId: formState.facility._id,
                buildingId: id
            }).unwrap()

            setFormState(prev => {
                return {
                    ...prev,
                    facility: resp.data
                }
            })

            enqueueSnackbar('Building removed', { variant: 'success' })
        } catch (err) {
            enqueueSnackbar(err.data ? err.data.message : "We could not process your request", {
                variant: 'warning'
            });
        }

    }

    const handleAddBuilding = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const resp = await addBuilding({
                building: buildingForm,
                id: formState.facility._id
            }).unwrap()

            setFormState(prev => {
                return {
                    ...prev,
                    facility: resp.data
                }
            })

            setBuildingForm(undefined)
            setOpenAddBuildingForm(false)

            enqueueSnackbar('Building added', { variant: 'success' })
        } catch (err) {
            enqueueSnackbar(err.data ? err.data.message : "We could not process your request", {
                variant: 'warning'
            });
        }

    }



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
        count: formState ? formState.estateStatus.statusCount : 0,
        page: page - 1,
        onTableChange: (action, tableState) => {
            switch (action) {
                case "changePage":
                    console.log(tableState.page);

                    setPage(tableState.page + 1);
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

    const style = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { sm: "90%", md: 500, lg: "500", xs: "90%" },
        maxHeight: "80%",
        // overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
    };

    const BuildingModal = () => {
        return (
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Card style={{ overflowY: "auto" }} sx={style}>
                        <CardHeader
                            sx={{
                                borderBottom: "1px solid #F5F5F5",
                                padding: "30px",
                                textAlign: "center",
                            }}
                            title={isLoading ? "loading...." : "All Buildings"}
                        />
                        <CardContent sx={{ px: "50px" }}>
                            {
                                formState && formState.facility.buildings ? formState.facility.buildings.map(building => {
                                    return (

                                        <ListItem
                                            secondaryAction={
                                                <IconButton onClick={() => handleRemoveBuilding(building._id)} edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <Home5LineIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={building.buildingType} secondary={`${building.price} room - ${building.price}`} />
                                        </ListItem>
                                    )
                                }) : 'No building for this facility yet'
                            }

                        </CardContent>

                    </Card>
                </Fade>
            </Modal>
        )
    }

    const AddBuildingModal = () => {
        return (
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openAddBuildingForm}
                onClose={() => setOpenAddBuildingForm(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openAddBuildingForm}>
                    <form onSubmit={handleAddBuilding}>
                        <Card style={{ overflowY: "auto" }} sx={style}>
                            <CardHeader
                                sx={{
                                    borderBottom: "1px solid #F5F5F5",
                                    padding: "30px",
                                    textAlign: "center",
                                }}
                                title={isLoading ? "loading...." : "All Buildings"}
                            />
                            <CardContent sx={{ px: "50px" }}>

                                <TentTextField
                                    required
                                    onChange={handleChange}
                                    sx={{
                                        border: "none",
                                        backgroundColor: "action.hover",
                                        borderRadius: "5px",
                                        marginBottom: "15px",
                                    }}
                                    name="buildingType"
                                    placeholder="Enter building type"
                                    type="text"
                                    fullWidth
                                />
                                <Stack direction="row" spacing={2}>
                                    <Grid item lg={7} sm={7} md={7} xs={7}>
                                        <TentTextField
                                            required
                                            onChange={handleChange}
                                            sx={{
                                                border: "none",
                                                backgroundColor: "action.hover",
                                                borderRadius: "5px",
                                            }}
                                            name="price"
                                            type="number"
                                            placeholder="Enter building price"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item lg={5} sm={5} md={5} xs={5}>
                                        <TentTextField
                                            required
                                            onChange={handleChange}
                                            sx={{
                                                border: "none",
                                                backgroundColor: "action.hover",
                                                borderRadius: "5px",
                                            }}
                                            name="numberOfRoom"
                                            type="number"
                                            placeholder="number of rooms"
                                            fullWidth
                                        />
                                    </Grid>
                                </Stack>

                            </CardContent>
                            <CardActions
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "32px 50px",
                                }}
                            >
                                <LoadingButton className="bg-blue-500" type="submit" loading={isLoadingAdd} fullWidth variant="contained">
                                    Add building
                                </LoadingButton>

                            </CardActions>

                        </Card>
                    </form>

                </Fade>
            </Modal>
        )
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
                                    <Stack spacing={2} direction={{ lg: 'row', xs: 'column', md: 'row', sm: 'row' }}>
                                        <Button onClick={() => setOpenAddBuildingForm(true)} variant='outlined' color='info'>
                                            Add building
                                        </Button>
                                        <Button onClick={() => setOpen(true)} variant='outlined' color='warning'>
                                            View buildings
                                        </Button>
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
            {BuildingModal()}
            {AddBuildingModal()}
        </DashboardLayout>
    )
}

export default WithAuth(Facility)

export const getServerSideProps = (context: GetServerSidePropsContext) => {
    return {
        props: { params: context.params }
    };
}
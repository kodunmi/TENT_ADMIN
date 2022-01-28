import { CardHeader, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { DataCountCard, ErrorData, FixedHeightGrid, SearchButton, TentCard, TentSpinner } from '../../components'
import { WithAuth } from '../../HOC'
import { useNextQueryParam } from '../../hooks'
import { DashboardLayout } from '../../layout'
import { useGetFacilityQuery } from '../../services'
import Delete from "remixicon-react/DeleteBinLineIcon";
import Edit from "remixicon-react/PencilLineIcon";
import View from 'remixicon-react/EyeLineIcon'
import { OrderType } from '../../lib'
import SearchIcon from '@mui/icons-material/Search';
const clickSearchButton = () => {
    console.log('hi');

}

interface Column {
    id:
    | "date"
    | "name"
    | "phone"
    | "email"
    | "userID"
    | "status"
    | "creator"
    | "delete"
    | "edit"
    | "view";
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: "right" | "center" | "left";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    {
        id: "date",
        label: "DATE CREATED",
        minWidth: 170,
        format: (value: number) => value.toLocaleString("en-US"),
    },
    { id: "name", label: "FULLNAME", minWidth: 200 },
    {
        id: "phone",
        label: "PHONE NO",
        minWidth: 100,
        align: "right",
    },
    {
        id: "email",
        label: "EMAIL",
        minWidth: 50,
        align: "left",
    },
    {
        id: "userID",
        label: "USER ID",
        minWidth: 70,
        align: "center",
    },
    {
        id: "status",
        label: "STATUS",
        minWidth: 70,
        align: "center",
    },
    {
        id: "creator",
        label: "CREATOR",
        minWidth: 70,
        align: "center",
    },
    {
        id: "view",
        label: "View",
        align: "center",
    },
    {
        id: "delete",
        label: "Delete",
        align: "center",
    },
    {
        id: "edit",
        label: "Edit",
        align: "center",
    },
];
const Facility = () => {
    const router = useRouter()
    let id: string | string[] = router.query.id;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const queryKey = 'id';
    const queryValue = router.query[queryKey] || router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`))
    console.log(queryValue, id);

    const id2 = useNextQueryParam(queryKey);


    const { refetch, isLoading, error, data } = useGetFacilityQuery({ id: '619156f7f8fa7d00164e43c5', estateStatusPageNumber: 1 }, {

    });

    useEffect(() => {
        refetch();
        console.log(data, isLoading, error);
    }, [id2]);



    return (
        <DashboardLayout
            title={<Typography variant="h4">Overview</Typography>}
            action={<SearchButton onclick={clickSearchButton} text="Live/Default" />}
        >
            {error ? <ErrorData error={error} /> : isLoading ? <TentSpinner /> : (
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <FixedHeightGrid
                        height={20}
                        justifyContent="stretch"
                        container
                        spacing={3}
                    >
                        <Grid lg={4} md={4} sm={6} xs={12} item>
                            <DataCountCard color="#EACA1F">
                                <Typography variant="h6">{data.data.summary.totalLandSize}</Typography>
                                <Typography variant="body2">Total Land Size</Typography>
                            </DataCountCard>
                        </Grid>
                        <Grid lg={4} md={4} sm={6} xs={12} item>
                            <DataCountCard color="#EACA1F">
                                <Typography variant="h6">{data.data.summary.totalBuildingSold}</Typography>
                                <Typography variant="body2">Total Building Sold</Typography>
                            </DataCountCard>
                        </Grid>
                        <Grid lg={4} md={4} sm={6} xs={12} item>
                            <DataCountCard color="#EACA1F">
                                <Typography variant="h6">{data.data.summary.totalUnitSold}</Typography>
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
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.data.estateStatus.status
                                                    .slice(
                                                        page * rowsPerPage,
                                                        page * rowsPerPage + rowsPerPage
                                                    )
                                                    .map((row: OrderType) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                role="checkbox"
                                                                tabIndex={-1}
                                                                key={row._id}
                                                            >
                                                                {columns.map((column: Column) => {
                                                                    const value = row[column.id];
                                                                    return (
                                                                        <TableCell
                                                                            key={column.id}
                                                                            align={column.align}
                                                                        >
                                                                            {column.id === "status" ? (
                                                                                <Button
                                                                                    sx={{
                                                                                        width: "102.97px",
                                                                                        boxShadow: "none",
                                                                                        borderRadius: "6px",
                                                                                        fontSize: "13px",
                                                                                        padding: "5px 10px",
                                                                                        backgroundColor:
                                                                                            row.status === 'complete' ? "#3BEA1F" : row.status === 'processing' ? '#26527c' : "#EACA1F",
                                                                                    }}
                                                                                    variant="contained"
                                                                                    size="small"
                                                                                >
                                                                                    {value}
                                                                                </Button>
                                                                            ) : column.id === "delete" ? (
                                                                                <IconButton>
                                                                                    <Delete />
                                                                                </IconButton>
                                                                            ) : column.id === "edit" ? (
                                                                                <IconButton>
                                                                                    <Edit />
                                                                                </IconButton>
                                                                            ) : (
                                                                                value
                                                                            )}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={data.data.estateStatus.status.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
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

import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { DashboardLayout } from "../../layout";
import { Button, CardHeader, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, IconButton } from "@mui/material";
import { AtmCard, DataCountCard, ErrorData, FixedHeightGrid, SearchButton, TentCard, TentSpinner } from "../../components";
import { FacilityType } from "../../lib";
import router from "next/router";
import Delete from "remixicon-react/DeleteBinLineIcon";
import Edit from "remixicon-react/PencilLineIcon";
import View from 'remixicon-react/EyeLineIcon'
import { useGetCardFacilitiesQuery, useGetFacilitiesQuery, useGetFacilitySummaryQuery } from "../../services";
import { useToken } from "../../hooks";
import { WithAuth } from "../../HOC";


interface Column {
  id:
  | "createdAt"
  | "estateName"
  | "totalLandSize"
  | "location"
  | "estateId"
  | "creator"
  | "delete"
  | "edit"
  | "view";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
  sortable?: boolean;
  editable?: boolean;
  resizable?: boolean;
}


const columns: Column[] = [
  { id: "createdAt", label: "DATE CREATED", minWidth: 70, sortable: true, editable: true, resizable: true },
  { id: "estateName", label: "ESTATE NAME", minWidth: 200 },
  { id: "totalLandSize", label: "SIZE (sqm)" },
  { id: "estateId", label: "ESTATE ID." },
  { id: "creator", label: "CREATOR" },
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

const rows: FacilityType[] = [
  {
    createdAt: "12/09/2021", estateName: "Paradise Valley Estate", totalLandSize: 500, estateId: "#ASDF2t34567", landSizeSold: 0, _id: 'uwwuwuw'
  },
  {
    createdAt: "12/09/2021", estateName: "Paradise Valley Estate", totalLandSize: 500, estateId: "#ASDF23456t7", landSizeSold: 0, _id: 'uwwuwuw'
  },
  {
    createdAt: "12/09/2021", estateName: "Paradise Valley Estate", totalLandSize: 500, estateId: "#ASDF2t34567", landSizeSold: 0, _id: 'uwwuwuw'
  }
];

const clickSearchButton = () => {
  alert("yeeheheh");
};

const FacilityPage = () => {
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const {token} = useToken()

  //   React.useMemo(() => {

  //     if(token === null){
  //       window.location.href = "/login"
  //     }

  //   }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const { data: cardData, error: cardDataError, isLoading: isLoadingCardData, isFetching } = useGetCardFacilitiesQuery('', {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  })

  const { data, error, isLoading } = useGetFacilitiesQuery({ pageNumber: 1 }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  })

  const { data: facilityData, error: facilityError, isLoading: loadingError } = useGetFacilitySummaryQuery('', {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  })

  if (!isLoading) console.log(data);


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <DashboardLayout
      title={<Typography variant="h4">Facilities</Typography>}
      action={<SearchButton onclick={clickSearchButton} text="Live/Default" />}
    >
      {
        error ? <ErrorData error={error} /> : isLoading ? <TentSpinner /> : (
          <Grid container>

            <Grid item lg={9} md={12} sm={12} xs={12}>
              <Stack spacing={1}>
                <Grid spacing={2} container>
                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard>
                      <Typography variant="h6">{!loadingError && facilityData.data.totalBuildings}</Typography>
                      <Typography variant="body2">Total Building</Typography>
                    </DataCountCard>
                  </Grid>
                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard>
                      <Typography variant="h6">{!loadingError && facilityData.data.totalEstates}</Typography>
                      <Typography variant="body2">Total Estates</Typography>
                    </DataCountCard>
                  </Grid>
                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard>
                      <Typography variant="h6">{!loadingError && facilityData.data.totalLandSize}</Typography>
                      <Typography variant="body2">Total Land Size</Typography>
                    </DataCountCard>
                  </Grid>
                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard>
                      <Typography variant="h6">{!loadingError && facilityData.data.totalUnitSold}</Typography>
                      <Typography variant="body2">Unit Sold</Typography>
                    </DataCountCard>
                  </Grid>
                </Grid>
                <Grid>
                  <TentCard>
                    <CardHeader
                      action={
                        <Button
                          color="primary"
                          variant="contained"
                          disableElevation
                        >
                          Add Facility
                        </Button>
                      }
                      title="List of Estates"
                    />

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
                          {!isLoading && data.data.facilities
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row: FacilityType) => {
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
                                        {column.id === "view" ? (
                                          <IconButton
                                            onClick={() =>
                                              router.push(`/facilities/${row._id}`)
                                            }
                                          >
                                            <View />
                                          </IconButton>
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
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TentCard>

                </Grid>
              </Stack>
            </Grid>

            <Grid item lg={3} md={12} sm={12} xs={12}>
              {
                cardDataError ? <ErrorData error={cardDataError} /> : isLoadingCardData ? <TentSpinner /> : (
                  cardData.data.map((data) =>{
                    return <AtmCard {...data}/>

                  })
                )
              }
            </Grid>
          </Grid>
        )
      }

    </DashboardLayout>
  );
}

export default WithAuth(FacilityPage);
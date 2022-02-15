import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { DashboardLayout } from "../../layout";
import { Button, CardHeader, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, IconButton, Modal, Fade, Card, Backdrop, CardContent, MenuItem, CardActions, TextField, InputAdornment } from "@mui/material";
import { AtmCard, DataCountCard, ErrorData, FixedHeightGrid, SearchButton, TentCard, TentSpinner, TentTextField } from "../../components";
import { FacilityType, statesOfNigeria } from "../../lib";
import router from "next/router";
import Delete from "remixicon-react/DeleteBinLineIcon";
import Edit from "remixicon-react/PencilLineIcon";
import View from 'remixicon-react/EyeLineIcon'
import { FacilityMutationType, useAddFacilityMutation, useGetCardFacilitiesQuery, useGetFacilitiesQuery, useGetFacilitySummaryQuery, } from "../../services";
import { useToken } from "../../hooks";
import { WithAuth } from "../../HOC";
import { LoadingButton } from "@mui/lab";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import SizeIcon from "remixicon-react/ShapeLineIcon";
import { useSnackbar } from 'notistack'


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
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formState, setFormState] = React.useState<FacilityMutationType>({
    estateName: "",
    estateDescription: "",
  });
  const [addFacility, result] = useAddFacilityMutation()
  const [buildings, setBuildings] = React.useState<number>(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {

    const split = name.split('.')
    if (split.length > 1) {
      setFormState((prev) => ({
        ...prev, [split[0]]: {
          ...prev[split[0]],
          [split[1]]: value
        }
      }))
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddFac = async (e:React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    try {
      const resp = await addFacility(formState).unwrap()

      console.log(resp);

      router.push('facilities/[id]', `/facilities/${resp.data._id}`)
      
      enqueueSnackbar('Facility Added Successfully', { variant: 'success' })

      

    } catch (err) {

      enqueueSnackbar(err.data ? err.data.message : "We could not process your request", {
        variant: 'warning'
      });
    }
  }

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


  const AddFacilityModal = () => {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <form onSubmit={handleAddFac}>
            <Card style={{ overflowY: "auto" }} sx={style}>
              <CardHeader
                sx={{
                  borderBottom: "1px solid #F5F5F5",
                  padding: "70px 0px 10px 0px",
                  textAlign: "center",
                }}
                title="Add new facility"
              />
              <CardContent sx={{ px: "50px" }}>
                <Stack spacing={3}>
                  <Stack spacing={2}>
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="estateLocation.address"
                      type="text"
                      placeholder="Insert Address"
                      label="Estate Location"
                      fullWidth
                    />
                    <TextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      select
                      label="Select state"
                      name="estateLocation.state"
                      type="select"
                      placeholder="Select state"
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>Select state</em>
                      </MenuItem>
                      {
                        statesOfNigeria.map(state => <MenuItem key={`b-${state}`} value={state}>{state}</MenuItem>)
                      }

                    </TextField>{" "}
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
                          name="estateLocation.city"
                          type="text"
                          placeholder="Select City"
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
                          name="estateLocation.zipCode"
                          type="text"
                          placeholder="Zip code"
                          fullWidth
                        />
                      </Grid>
                    </Stack>




                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="estateName"
                      placeholder="Enter estate name"
                      type="text"
                      label="Estate Information"
                      fullWidth
                    />
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="estateDescription"
                      type="text"
                      placeholder="Enter estate description"
                      fullWidth
                      minRows={5}
                      multiline
                    />
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="totalLandSize"
                      placeholder="Enter total land size"
                      type="number"
                      label="Land Information"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SizeIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption">
                              Sqm
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="totalLandPrice"
                      placeholder="Enter total land price"
                      type="number"
                      fullWidth
                    />

                    {/* <Typography variant="h6" textAlign='center' gutterBottom>
                      Click on add Building button to add building
                    </Typography> */}

                      {
                        [...Array(buildings)].map((e, i) =>
                        <div style={{ textAlign: 'center', marginBottom:'20', borderBottom: '1px solid gray', paddingBottom:'20px' }}>

                      <Stack direction='row' justifyContent='space-between'>
                        <Typography variant="h6">
                          # {i + 1}
                        </Typography>
                        <Button onClick={() => setBuildings((state) => state + 1 )} sx={{ borderRadius:'20px' , mb:'15px' }} variant="outlined" color="info">
                        <AddCircleOutline />
                        Add Building
                        </Button>
                        <Button onClick={() => setBuildings((state) => state - 1 )} sx={{ borderRadius:'20px' , mb:'15px' }} variant="outlined" color="error">
                        
                        <RemoveCircleOutline />
                         Remove Building
                      </Button>
                      </Stack>
              
                      
                      <TentTextField
                        required
                        onChange={handleChange}
                        sx={{
                          border: "none",
                          backgroundColor: "action.hover",
                          borderRadius: "5px",
                          marginBottom: "15px",
                        }}
                        name="buildings[].buildingType"
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
                            name="buildings[].price"
                            type="text"
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
                            name="buildings[].numberOfRoom"
                            type="text"
                            placeholder="number of rooms"
                            fullWidth
                          />
                        </Grid>
                      </Stack>
                    </div>
                        )
                      }

                    {/* <Button onClick={() => setBuildings((state) => state + 1 )}>
                      <AddCircleOutline />
                      Add Building
                    </Button> */}


                  </Stack>
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
                <LoadingButton loading={result.isLoading} className="bg-blue-500" type="submit" fullWidth variant="contained">
                  Save & Continue
                </LoadingButton>

              </CardActions>
            </Card>
          </form>

        </Fade>
      </Modal>
    )
  }


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
          <Grid container spacing={4}>

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
                          className="bg-blue-500"
                          onClick={() => setOpen(true)}
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
                  cardData.data.map((data) => {
                    return <AtmCard {...data} />

                  })
                )
              }
            </Grid>
          </Grid>
        )
      }
      {AddFacilityModal()}

    </DashboardLayout>
  );
}

export default WithAuth(FacilityPage);
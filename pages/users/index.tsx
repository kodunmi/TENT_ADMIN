import {
  Backdrop,
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FixedHeightGrid,
  SearchButton,
  DataCountCard,
  TentCard,
  TentTextField,
  TentSpinner,
  ErrorData,
} from "../../components";
import { DashboardLayout } from "../../layout";
import Delete from "remixicon-react/DeleteBinLineIcon";
import Edit from "remixicon-react/PencilLineIcon";
import View from 'remixicon-react/EyeLineIcon'
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import { RegisterUserRequest, useAddUserMutation, useGetUserSammaryQuery, useGetUsersQuery } from "../../services";
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from 'notistack'
import moment from "moment";
import { statesOfNigeria, UserDataType } from "../../lib";



const Users = () => {

  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(true);
  const [printBtn, setPrintBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);
  const [page, setPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const [formState, setFormState] = React.useState<UserDataType>()

  const [addUser, { isLoading: addingUser }] = useAddUserMutation();

  const { data, isLoading, isFetching, error, isError, refetch } = useGetUsersQuery({ pageNumber: page }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const { data: summaryData, isLoading: loadingSummary, error: summaryError } = useGetUserSammaryQuery('', {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  useEffect(() => {
    refetch()
  }, [page]);
  




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

  const handleRegisterNewUser = async (e) => {

    e.preventDefault();
    try {
      const { data } = await addUser(formState).unwrap();

      router.push('/users/[id]', `/users/${data._id}`);

    } catch (err) {
      enqueueSnackbar(err.data ? err.data.message : "We could not process your request", {
        variant: 'warning'
      });
    }

  };


  const columns: MUIDataTableColumnDef[] = [
    { name: "id", label: "ID", options: { display: "false" } },
    { name: "date", label: "Date" },
    { name: "name", label: "Name", options: { filterOptions: { fullWidth: true } } },
    { name: "phone", label: "Phone", options: { filterOptions: { fullWidth: true } } },
    { name: "email", label: "Email", options: { filterOptions: { fullWidth: true } } },
    { name: "userID", label: "User ID", options: { filterOptions: { fullWidth: true } }
    },
    { name: "status", label: "Status", 
    options: {
      filterOptions: { 
        fullWidth: true 
       },
       customBodyRender: (value: boolean, tableMeta, updateValue) => {
         return (
           <Button
               sx={{
                 width: "102.97px",
                 boxShadow: "none",
                 borderRadius: "6px",
                 fontSize: "13px",
                 padding: "5px 10px",
                 backgroundColor: "#EACA1F",
               }}
               variant="contained"
               size="small"
               className={value ? "bg-green-300" : "bg-yellow-500"}
             >
              {value  ? "VERIFIED" : "UNVERIFIED"}
             </Button>
         )
       }
     
     } 
     },
    { name: "creator", label: "Creator", options: { filterOptions: { fullWidth: true } } },
    {
      name: "Delete",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button onClick={() => {

            }}>
              Delete
            </button>
          );
        }
      }
    },
    {
      name: "Edit",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button onClick={() => window.alert(`Clicked "Edit" for row ${tableMeta.rowIndex}`)}>
              View
            </button>
          );
        }
      }
    },
  ];

  const options: MUIDataTableOptions = {
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight,
    tableBodyMaxHeight,
    rowsPerPage: 20,
    serverSide: false,
    count: data?.data.userCount,
    page: page - 1,
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          setPage(tableState.page + 1);
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

      router.push(`/users/${rowData[0]}`);
    },



  };

  let newData = [];

  if (!isLoading && !isError && data) {
    newData = data.data.users.map((user) => {
      return {
        id: user._id,
        date: user.createdAt,
        name: user.fullName,
        phone: user.phoneNumber,
        email: user.email,
        userID: user.tentUserId,
        status: user.accountVerified,
        creator: user.creator,

      }
    })
  }




  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { sm: "90%", md: 500, lg: "90%", xs: "90%" },
    maxHeight: "90%",
    // overflowY: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
  };

  const AddUserModal = (
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
        <form onSubmit={handleRegisterNewUser}>
          <Card style={{ overflowY: "auto" }} sx={style}>
            <CardHeader
              sx={{
                borderBottom: "1px solid #F5F5F5",
                padding: "70px 0px 10px 0px",
                textAlign: "center",
              }}
              title="Add User information"
            />
            <CardContent sx={{ px: "50px" }}>
              {/* <Stack spacing={4}>
                <TentTextField
                  onChange={handleChange}
                  required
                  name="fullName"
                  type="text"
                  placeholder="name"
                  label="Your Name"
                />
                <TentTextField
                  onChange={handleChange}
                  required
                  name="email"
                  type="email"
                  placeholder="email"
                  label="Email"
                />
                <TentTextField
                  onChange={handleChange}
                  required
                  name="phoneNumber"
                  type="text"
                  placeholder="phone"
                  label="Phone"
                  fullWidth
                />
                <TentTextField
                  onChange={handleChange}
                  required
                  name="password"
                  type="text"
                  placeholder="password"
                  label="Password"
                  fullWidth
                />
                <Stack direction="row" spacing={2}>
                  <Grid item lg={6} sm={6} md={6} xs={6}>
                    <TentTextField
                      onChange={handleChange}
                      required
                      name="dateOfBirth"
                      type="date"
                      placeholder="name"
                      label="Date of Birth"
                      fullWidth
                    />
                  </Grid>
                  <Grid item lg={6} sm={6} md={6} xs={6}>
                    <TentTextField
                      onChange={handleChange}
                      required
                      select
                      name="gender"
                      type="select"
                      placeholder="Select gender"
                      label="Gender"
                      fullWidth
                    >
                      <MenuItem value='female' >Female</MenuItem>
                      <MenuItem value='male'>Male</MenuItem>
                    </TentTextField>{" "}
                  </Grid>
                </Stack>
              </Stack> */}
              <Grid container spacing={3}>
                <Grid lg={4} md={12} sm={12} xs={12} item>
                  <Stack spacing={2}>
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="fullName"
                      type="text"
                      placeholder="name"
                      label="Your Name"
                    />
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="email"
                      type="email"
                      placeholder="email"
                      label="Email"
                    />
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="phoneNumber"
                      type="text"
                      placeholder="phone"
                      label="Phone"
                      fullWidth
                    />
                    <Stack direction="row" spacing={2}>
                      <Grid item lg={6} sm={6} md={6} xs={6}>
                        <TentTextField
                          required
                          onChange={handleChange}
                          sx={{
                            border: "none",
                            backgroundColor: "action.hover",
                            borderRadius: "5px",
                          }}
                          name="dateOfBirth"
                          type="date"
                          placeholder="name"
                          label="Date of Birth"
                          fullWidth
                        />
                      </Grid>
                      <Grid item lg={6} sm={6} md={6} xs={6}>
                        <TentTextField
                          required
                          onChange={handleChange}
                          sx={{
                            border: "none",
                            backgroundColor: "action.hover",
                            borderRadius: "5px",
                          }}
                          select
                          name="gender"
                          type="select"
                          placeholder="Select gender"
                          label="Gender"
                          fullWidth
                        >
                          <MenuItem >Select gender</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                        </TentTextField>{" "}
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
                      name="password"
                      type="password"
                      placeholder="password"
                      label="Password"
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid lg={4} md={12} sm={12} xs={12} item>
                  <Stack spacing={2}>
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="residentialAddress.address"
                      type="text"
                      placeholder="Insert Address"
                      label="Residential Address"
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
                      select
                      name="residentialAddress.state"
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

                    </TentTextField>{" "}
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
                          name="residentialAddress.city"
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
                          name="residentialAddress.zipCode"
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
                      select
                      name="stateOfOrigin"
                      type="select"
                      placeholder="Select state"
                      label="State of Origin"
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>Select state</em>
                      </MenuItem>
                      {
                        statesOfNigeria.map(state => <MenuItem key={`b-${state}`} value={state}>{state}</MenuItem>)
                      }

                    </TentTextField>{" "}
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      select
                      name="maritalStatus"
                      type="select"
                      label="Marital Status"
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>Select status</em>
                      </MenuItem>
                      <MenuItem value="married">Married</MenuItem>
                      <MenuItem value="single" >Single</MenuItem>
                    </TentTextField>{" "}
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="occupation"
                      type="text"
                      label="Occupation"
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
                      name="businessAddress.address"
                      type="text"
                      placeholder="Insert Address"
                      label="Office Address"
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
                          name="businessAddress.city"
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
                          name="businessAddress.zipCode"
                          type="text"
                          placeholder="Zip code"
                          fullWidth
                        />
                      </Grid>

                    </Stack>
                    <Stack>
                      <TentTextField
                        required
                        onChange={handleChange}
                        sx={{
                          border: "none",
                          backgroundColor: "action.hover",
                          borderRadius: "5px",
                        }}
                        select
                        name="businessAddress.state"
                        type="select"
                        placeholder="Select state"
                        fullWidth
                      >
                        <MenuItem value={undefined}>
                          <em>Select state</em>
                        </MenuItem>
                        {
                          statesOfNigeria.map(state => <MenuItem key={`b-${state}`} value={state}>{state}</MenuItem>)
                        }

                      </TentTextField>{" "}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid lg={4} md={12} sm={12} xs={12} item>
                  <Stack spacing={2}>
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="nextOfKin.name"
                      type="text"
                      placeholder="Next of Kin"
                      label="Name of Next of Kin"
                    />
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="nextOfKin.address"
                      type="text"
                      placeholder="Insert Address"
                      label="Next of Kin Address"
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
                          name="nextOfKin.city"
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
                          select
                          name="nextOfKin.state"
                          type="select"
                          placeholder="Select state"
                          fullWidth
                        >
                          <MenuItem value={undefined}>
                            <em>Select state</em>
                          </MenuItem>
                          {
                            statesOfNigeria.map(state => <MenuItem key={`b-${state}`} value={state}>{state}</MenuItem>)
                          }

                        </TentTextField>{" "}
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
                      name="nextOfKin.phoneNumber"
                      type="text"
                      placeholder="Phone"
                      label="Next of Kin Phone"
                    />
                    <TentTextField
                      required
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "action.hover",
                        borderRadius: "5px",
                      }}
                      name="nextOfKin.relationship"
                      type="text"
                      placeholder="Relationship"
                      label="What's your relationship"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 50px",
              }}
            >
              <LoadingButton className="bg-blue-500" type="submit" loading={addingUser} fullWidth variant="contained">
                Save & Continue
              </LoadingButton>

            </CardActions>
          </Card>
        </form>

      </Fade>
    </Modal>
  );

  return (
    <DashboardLayout
      action={<SearchButton onclick={() => { }} text="Live/Default" />}
      title={<Typography variant="h4">Users Dashboard</Typography>}
    >
      {
        error ? <ErrorData error={error} /> : isLoading ? <TentSpinner /> : (
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            {
              summaryError ? <h2>Error loading data</h2> : (
                <FixedHeightGrid
                  height={20}
                  justifyContent="stretch"
                  container
                  spacing={3}
                >

                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard color="#EA1FD6">
                      <Typography variant="h6">{loadingSummary ? 'loading' : summaryData.data.totalUsers}</Typography>
                      <Typography variant="body2">Total users</Typography>
                    </DataCountCard>
                  </Grid>
                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard color="#1565D8">
                      <Typography variant="h6">{loadingSummary ? 'loading' : summaryData.data.newUsers}</Typography>
                      <Typography variant="body2">New users</Typography>
                    </DataCountCard>
                  </Grid>
                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard color="#EACA1F">
                      <Typography variant="h6">{loadingSummary ? 'loading' : summaryData.data.unverifiedUsers}</Typography>
                      <Typography variant="body2">Unverified users</Typography>
                    </DataCountCard>
                  </Grid>
                  <Grid lg={3} md={3} sm={6} xs={12} item>
                    <DataCountCard color="#3BEA1F">
                      <Typography variant="h6">{loadingSummary ? 'loading' : summaryData.data.verifiedUsers}</Typography>
                      <Typography variant="body2">Verified users</Typography>
                    </DataCountCard>
                  </Grid>
                </FixedHeightGrid>
              )
            }

            <FixedHeightGrid
              height={80}
              justifyContent="stretch"
              container
              spacing={3}
            ></FixedHeightGrid>
            <FixedHeightGrid height={50}>
              <TentCard>
                <CardHeader
                  action={
                    <Button
                      onClick={handleOpen}
                      color="primary"
                      variant="contained"
                      disableElevation
                      className="bg-blue-500"
                    >
                      Add new user
                    </Button>
                  }
                  title="List of users"
                />
                <Grid>
                  <MUIDataTable
                    title={
                      <Typography variant="h6">
                        {isFetching && (
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
                </Grid>
              </TentCard>
            </FixedHeightGrid>
          </Stack>
        )
      }

      {AddUserModal}
    </DashboardLayout>
  );
};

export default Users;

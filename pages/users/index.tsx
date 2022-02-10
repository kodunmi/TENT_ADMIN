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
  const [formState, setFormState] = React.useState<RegisterUserRequest>({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: ''
  })

  const [addUser, { isLoading: addingUser }] = useAddUserMutation();

  const { data, isLoading, error, refetch } = useGetUsersQuery({ pageNumber: page }, {
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
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }))

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
    { name: "userID", label: "User ID", options: { filterOptions: { fullWidth: true } } },
    { name: "status", label: "Status", options: { filterOptions: { fullWidth: true } } },
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
    onRowClick: (rowData, rowMeta) => {
      console.log("Row clicked: ", rowData, "Row Index:", rowMeta.dataIndex);

      router.push(`/users/${rowData[0]}`);
    },



  };

  let newData = [];

  if (!isLoading) {
    newData = data.data.users.map((user) => {
      return {
        id: user._id,
        date: user.createdAt,
        name: user.fullName,
        phone: user.phoneNumber,
        email: user.email,
        userID: user.tentUserId,
        status: user.accountVerified ? 'Verified' : 'Not Verified',
        creator: user.creator,

      }
    })
  }




  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { sm: "90%", md: 500, lg: 500 },
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
              <Stack spacing={4}>
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
              <LoadingButton type="submit" loading={addingUser} fullWidth variant="contained">
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

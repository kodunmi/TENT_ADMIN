import {
  Backdrop,
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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
import React from "react";
import {
  FixedHeightGrid,
  SearchButton,
  DataCountCard,
  TentCard,
  TentTextField,
} from "../../components";
import { DashboardLayout } from "../../layout";
import Delete from "remixicon-react/DeleteBinLineIcon";
import Edit from "remixicon-react/PencilLineIcon";
import View from 'remixicon-react/EyeLineIcon'
import { useRouter } from "next/router";
import { Box } from "@mui/system";

const clickSearchButton = () => {};

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

interface Data {
  date: string;
  name: string;
  phone: string;
  email: string;
  userID: string;
  status: "VERIFIED" | "UNVERIFIED";
  creator: "USER" | "ADMIN";
}

function createData(
  date: string,
  name: string,
  phone: string,
  email: string,
  userID: string,
  status: "VERIFIED" | "UNVERIFIED",
  creator: "USER" | "ADMIN"
): Data {
  return { date, name, phone, email, userID, status, creator };
}

const rows = [
  createData(
    "2020-01-05",
    "Kodunmi lekan",
    "09012345678",
    "Ugo@tentgroup.com",
    "ASDF234567",
    "VERIFIED",
    "ADMIN"
  ),
  createData(
    "2020-01-05",
    "Kodunmi lekan",
    "09012345678",
    "Ugo@tentgroup.com",
    "ASDF234563",
    "UNVERIFIED",
    "ADMIN"
  ),
  createData(
    "2020-01-05",
    "Kodunmi lekan",
    "09012345678",
    "Ugo@tentgroup.com",
    "ASDF234367",
    "UNVERIFIED",
    "ADMIN"
  ),
  createData(
    "2020-01-05",
    "Kodunmi lekan",
    "09012345678",
    "Ugo@tentgroup.com",
    "ASDF134567",
    "UNVERIFIED",
    "ADMIN"
  ),
  createData(
    "2020-01-05",
    "Kodunmi lekan",
    "09012345678",
    "Ugo@tentgroup.com",
    "ASDF235567",
    "UNVERIFIED",
    "ADMIN"
  ),
];

const Users = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
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
        <Card sx={style}>
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
                name="name"
                type="text"
                placeholder="name"
                label="Your Name"
              />
              <TentTextField
                name="email"
                type="email"
                placeholder="email"
                label="Email"
              />
              <TentTextField
                name="phone"
                type="text"
                placeholder="phone"
                label="Phone"
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <Grid item lg={6} sm={6} md={6} xs={6}>
                  <TentTextField
                    name="date"
                    type="date"
                    placeholder="name"
                    label="Date of Birth"
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} sm={6} md={6} xs={6}>
                  <TentTextField
                    select
                    name="gender"
                    type="select"
                    placeholder="Select gender"
                    label="Gender"
                    fullWidth
                  >
                    <MenuItem>Female</MenuItem>
                    <MenuItem>Male</MenuItem>
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
            <Button fullWidth variant="contained">
              Save & Continue
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );

  return (
    <DashboardLayout
      action={<SearchButton onclick={clickSearchButton} text="Live/Default" />}
      title={<Typography variant="h4">Users Dashboard</Typography>}
    >
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <FixedHeightGrid
          height={20}
          justifyContent="stretch"
          container
          spacing={3}
        >
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <DataCountCard color="#EA1FD6">
              <Typography variant="h6">3,3000</Typography>
              <Typography variant="body2">Total users</Typography>
            </DataCountCard>
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <DataCountCard color="#1565D8">
              <Typography variant="h6">3,3000</Typography>
              <Typography variant="body2">Total users</Typography>
            </DataCountCard>
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <DataCountCard color="#EACA1F">
              <Typography variant="h6">3,3000</Typography>
              <Typography variant="body2">Total users</Typography>
            </DataCountCard>
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <DataCountCard color="#3BEA1F">
              <Typography variant="h6">3,3000</Typography>
              <Typography variant="body2">Total users</Typography>
            </DataCountCard>
          </Grid>
        </FixedHeightGrid>
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
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row: Data) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.userID}
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
                                            row.status === "VERIFIED"
                                              ? "#3BEA1F"
                                              : "#EACA1F",
                                        }}
                                        variant="contained"
                                        size="small"
                                      >
                                        {value}
                                      </Button>
                                    ): column.id === "view" ? (
                                      <IconButton
                                      onClick={() =>
                                        router.push(`/users/${row.userID}`)
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
              </Paper>
            </Grid>
          </TentCard>
        </FixedHeightGrid>
      </Stack>
      {AddUserModal}
    </DashboardLayout>
  );
};

export default Users;

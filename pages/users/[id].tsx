import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DashboardLayout } from "../../layout";
import Back from "remixicon-react/ArrowLeftLineIcon";
import { border, Box } from "@mui/system";
import { TentTextField } from "../../components";

const Header = (
  <Stack alignItems="center" direction="row" spacing={2}>
    <IconButton>
      <Link href="/users">
        <Back size={30} />
      </Link>
    </IconButton>
    <Typography variant="h4">Users Details</Typography>
  </Stack>
);

const User = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <DashboardLayout
      background="deem"
      action={
        <Button sx={{ float: "right" }} variant="contained">
          Save and continue
        </Button>
      }
      title={Header}
    >
      <Stack
        alignItems={{ lg: "center", xs: "left", md: "center", sm: "center" }}
        direction={{ lg: "row", xs: "column", md: "row", sm: "row" }}
        justifyContent="space-between"
      >
        <Stack alignItems="center" direction="row" spacing={3}>
          <Avatar
            sx={{
              width: "100px",
              height: "100px",
              backgroundColor: "#F3B100",
              color: "#FFE3AD",
            }}
          />
          <Stack>
            <Typography variant="h4">Kodunmi Olalekan</Typography>
            <Typography variant="body1">#126317000</Typography>
          </Stack>
        </Stack>
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
        >
          UNVERIFIED
        </Button>
      </Stack>
      <Stack mt="42px">
        <Grid container spacing={12}>
          <Grid lg={4} md={12} sm={12} xs={12} item>
            <Stack spacing={2}>
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
              <TentTextField
                name="password"
                type="password"
                placeholder="password"
                label="Password"
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid lg={4} md={12} sm={12} xs={12} item>
            <Stack  spacing={2}>
              <TentTextField
                name="address"
                type="text"
                placeholder="Insert Address"
                label="Residential Address"
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <Grid item lg={7} sm={7} md={7} xs={7}>
                  <TentTextField
                    name="city"
                    type="text"
                    placeholder="Select City"
                    fullWidth
                  />
                </Grid>
                <Grid item lg={5} sm={5} md={5} xs={5}>
                  <TentTextField
                    name="zip"
                    type="text"
                    placeholder="Zip code"
                    fullWidth
                  />
                </Grid>
              </Stack>
              <TentTextField
                select
                name="state"
                type="select"
                placeholder="Select state"
                label="State of Origin"
                fullWidth
              >
                <MenuItem value="">
                  <em>Select state</em>
                </MenuItem>
                <MenuItem>Abuja</MenuItem>
                <MenuItem>Lagos</MenuItem>
              </TentTextField>{" "}
              <TentTextField
                select
                name="marritalStatus"
                type="select"
                label="Marital Status"
                fullWidth
              >
                <MenuItem value="">
                  <em>Select status</em>
                </MenuItem>
                <MenuItem>Married</MenuItem>
                <MenuItem>Single</MenuItem>
              </TentTextField>{" "}
              <TentTextField
                select
                name="occupation"
                type="select"
                label="Occupation"
                fullWidth
              >
                <MenuItem value="">
                  <em>Select Occupation</em>
                </MenuItem>
                <MenuItem>Occupation One</MenuItem>
                <MenuItem>Occupation Two</MenuItem>
              </TentTextField>{" "}
              <TentTextField
                name="officeAddress"
                type="text"
                placeholder="Insert Address"
                label="Office Address"
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <Grid item lg={7} sm={7} md={7} xs={7}>
                  <TentTextField
                    name="city"
                    type="text"
                    placeholder="Select City"
                    fullWidth
                  />
                </Grid>
                <Grid item lg={5} sm={5} md={5} xs={5}>
                  <TentTextField
                    name="zip"
                    type="text"
                    placeholder="Zip code"
                    fullWidth
                  />
                </Grid>
              </Stack>
            </Stack>
          </Grid>
          <Grid lg={4} md={12} sm={12} xs={12} item>
            <Stack spacing={2}>
              <TentTextField
                name="NOKName"
                type="text"
                placeholder="Next of Kin"
                label="Name of Next of Kin"
              />
              <TentTextField
                name="NOKAddress"
                type="text"
                placeholder="Insert Address"
                label="Next of Kin Address"
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <Grid item lg={7} sm={7} md={7} xs={7}>
                  <TentTextField
                    name="city"
                    type="text"
                    placeholder="Select City"
                    fullWidth
                  />
                </Grid>
                <Grid item lg={5} sm={5} md={5} xs={5}>
                  <TentTextField
                    name="zip"
                    type="text"
                    placeholder="Zip code"
                    fullWidth
                  />
                </Grid>
              </Stack>
              <TentTextField
                name="NOKPhone"
                type="text"
                placeholder="Phone"
                label="Next of Kin Phone"
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
};

export default User;

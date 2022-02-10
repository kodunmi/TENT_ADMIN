import React, { useEffect } from "react";
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
import { WithAuth } from "../../HOC";
import { BaseResponse, statesOfNigeria, UserDataType } from "../../lib";
import { useEditProfileMutation, useGetUserQuery, useLazyGetUserQuery } from "../../services";
import { useSnackbar } from "notistack";
import moment from 'moment';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { LoadingButton } from "@mui/lab";


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

const User = ({params}:{params: ParsedUrlQuery} )=> {




  const router = useRouter();
  // const { id } = router.query;
  const queryKey = 'id';
  const id = router.query[queryKey] || router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`))
  
  const formRef = React.useRef<HTMLFormElement>(null);
  const [editProfile, { isLoading: isEditing }] = useEditProfileMutation()
  const [trigger, result, lastPromiseInfo] = useLazyGetUserQuery()
  const [formState, setFormState] = React.useState<UserDataType>(null);
  const { enqueueSnackbar } = useSnackbar();



  // const { data, isLoading, error } = useGetUserQuery(id, {
  //   refetchOnMountOrArgChange: true,
  //   refetchOnReconnect: true,
  //   skip: !id,
  // })

  
  useEffect(() => {
      trigger(params.id)
  }, [params, trigger]);

  useEffect(() => {
    if (result.isSuccess && result.isLoading === false) {
      setFormState(result.data.data)
    }
  }, [result])

  
  
  

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

  const handleProfileUpdate = async (e) => {

    e.preventDefault()
    if (formRef.current.reportValidity()) {

      const editProfileData: UserDataType = {

        gender: formState.gender,
        dateOfBirth: formState.dateOfBirth,
        profileImage: formState.profileImage,
        stateOfOrigin: formState.stateOfOrigin,
        maritalStatus: formState.maritalStatus,
        occupation: formState.occupation,
        fullName: formState.fullName,
        // email: formState.email,
        // phoneNumber: formState.phoneNumber,
        nextOfKin: {
          name: formState.nextOfKin.name,
          relationship: formState.nextOfKin.relationship,
          phoneNumber: formState.nextOfKin.address,
          address: formState.nextOfKin.address,
          state: formState.nextOfKin.state,
          city: formState.nextOfKin.city,
        },
        residentialAddress: {
          address: formState.residentialAddress.address,
          city: formState.residentialAddress.city,
          state: formState.residentialAddress.state,
          zipCode: formState.residentialAddress.zipCode,
        },
        businessAddress: {
          address: formState.businessAddress.address,
          city: formState.businessAddress.city,
          state: formState.businessAddress.state,
          zipCode: formState.businessAddress.zipCode,
        }
      }

      try {

        const res = await editProfile({ data: editProfileData, id: formState._id }).unwrap()

        console.log(res);

        enqueueSnackbar(res.message, {
          variant: 'success'
        });

      } catch (err) {
        enqueueSnackbar(err.data ? err.data.message : "We could not process your request", {
          variant: 'warning'
        });
      }
    }
  }
  return (
    <DashboardLayout
      background="deem"
      action={
        <LoadingButton sx={{ float: "right" }} loading={isEditing} onClick={(e) => handleProfileUpdate(e)} variant="contained" color="primary">Save and Continue</LoadingButton>
        
      }
      title={Header}
    >
      {
        formState && (
          <div>
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
                  <Typography variant="h4">{formState?.fullName}</Typography>
                  <Typography variant="body1">{formState?.tentUserId}</Typography>
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
               {formState.profileVerified ? "VERIFIED" : "UNVERIFIED"}
              </Button>
            </Stack>
            <Stack mt="42px">
            <form ref={formRef}>
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
                      value={formState.fullName}
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
                      value={formState.email}
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
                      value={formState.phoneNumber}
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
                          value={formState.dateOfBirth && moment(formState.dateOfBirth).format('YYYY-MM-DD')}
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
                          value={formState.gender}
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
                      value={formState.residentialAddress && formState.residentialAddress.address}
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
                      value={formState.residentialAddress && formState.residentialAddress.state}
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
                          value={formState.residentialAddress && formState.residentialAddress.city}
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
                          value={formState.residentialAddress && formState.residentialAddress.zipCode}
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
                      value={formState.stateOfOrigin}
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
                      value={formState.maritalStatus}
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
                      value={formState.occupation}
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
                      value={formState.businessAddress && formState.businessAddress.address}
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
                          value={formState.businessAddress && formState.businessAddress.city}
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
                          value={formState.businessAddress && formState.businessAddress.zipCode}
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
                        value={formState.businessAddress && formState.businessAddress.state}
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
                      value={formState.nextOfKin && formState.nextOfKin.name}
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
                      value={formState.nextOfKin && formState.nextOfKin.address}
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
                          value={formState.nextOfKin && formState.nextOfKin.city}
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
                          value={formState.nextOfKin && formState.nextOfKin.state}
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
                      value={formState.nextOfKin && formState.nextOfKin.phoneNumber}
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
                      value={formState.nextOfKin && formState.nextOfKin.relationship}
                      type="text"
                      placeholder="Relationship"
                      label="What's your relationship"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </form>

          </Stack>
          </div>

        )
      }

    </DashboardLayout>
  );
};

export default WithAuth(User);

export const getServerSideProps = (context:GetServerSidePropsContext) => {
  return {
    props: {params: context.params}
  };
}

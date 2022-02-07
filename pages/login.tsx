import React from 'react'
import { AuthLayout } from '../layout'
import styled from 'styled-components'
import { Box } from '@mui/system'
import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { TentTextField, useNoBorder } from '../components'
import Mail from 'remixicon-react/MailLineIcon'
import Key from 'remixicon-react/KeyLineIcon'
import EyeOpen from 'remixicon-react/EyeLineIcon'
import EyeClosed from 'remixicon-react/EyeCloseLineIcon'
import Link from 'next/link'
import { LoginRequest, useLoginMutation } from '../services'
import { setCredentials } from '../redux'
import { useAppDispatch } from '../hooks'
import { LoadingButton } from '@mui/lab'
import { useSnackbar, VariantType } from 'notistack'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'


const Login = () => {
    const formRef = React.useRef<HTMLFormElement>(null);
    const { enqueueSnackbar } = useSnackbar();
    const classes = useNoBorder();
    const [visible, setVisible] = React.useState(false)


    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const [formState, setFormState] = React.useState<LoginRequest>({
        email: '',
        password: '',
    })

    const [login, { isLoading }] = useLoginMutation()

    const dispatch = useDispatch()
    const {push} = useRouter()

    const handleChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) =>
        setFormState((prev) => ({ ...prev, [name]: value }))

    return (
        <AuthLayout>
            <Box style={{ position: "relative" }}>
                <img src="/images/shapes/Ellipse 2 (1).png" height="200px" width="100%" alt="" />
                <img style={{ position: "absolute", zIndex: 2, right: "10%", top: "5%" }} src="/images/Vector1.png" height="16%" alt="" />
                <Box px={3} pb={2}>
                    <Typography variant="h5">
                        <b>Welcome to admin</b>
                    </Typography>
                    <Typography component="div" mb={6} variant="caption">
                        Sign to your account
                    </Typography>
                    <form ref={formRef}>
                        <Typography variant="body1">
                            Email
                        </Typography>
                        <TextField
                            required
                            variant="outlined"
                            onChange={handleChange}
                            sx={{
                                border: "none",
                                backgroundColor: "action.hover",
                                borderRadius: "5px",
                                mb: "20px",
                            }}
                            name="email"
                            type="email"
                            placeholder="enter email"
                            // label="Email"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail />
                                    </InputAdornment>
                                ),
                               
                                classes: { notchedOutline: classes.noBorder },
                            }}
                        />
                         <Typography variant="body1">
                            Password
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            onChange={handleChange}
                            sx={{
                                border: "none",
                                backgroundColor: "action.hover",
                                borderRadius: "5px",

                            }}
                            name="password"
                            type={!visible ? "password" :"text"}
                            placeholder="enter password"
                            // label="Password"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Key />
                                    </InputAdornment>
                                ),
                                endAdornment:(
                                    <IconButton onClick={() => toggleVisibility()}>
                                      { visible ?  <EyeClosed /> : <EyeOpen/>}
                                    </IconButton>
                                ),
                                classes: { notchedOutline: classes.noBorder },
                            }}
                        />
                    </form>

                    <Link href="forget-password">
                        <Typography align="right" component="div" mb={6} variant="caption">
                            Forgot Password?
                        </Typography>
                    </Link>
                    {/* <Link href="verify-email">
                    <Typography align="right" component="div" mb={6} variant="caption">
                        verify Password?
                    </Typography>
                    </Link> */}

                    <LoadingButton fullWidth size="large" color="neutral" variant="contained"
                        loading={isLoading}
                        onClick={async () => {
                            if (formRef.current.reportValidity()) {
                                try {
                                    const user = await login(formState).unwrap()
                                    dispatch(setCredentials(user.data))
                                    push('/dashboard')
                                    console.log(user);

                                } catch (err) {
                                     console.log(err);
                                     if(err.status === 409){
                                        push(`verify-email?email=${formState.email}`)
                                     }
                                    enqueueSnackbar(err.data ? err.data.message : "We could not process your request", {
                                        variant: 'warning'
                                    });

                                }
                            }

                        }}
                    >
                        Login
                    </LoadingButton>
                   
                </Box>
            </Box>
        </AuthLayout>
    )
}

export default Login

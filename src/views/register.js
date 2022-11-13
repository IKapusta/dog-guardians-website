import React, {useState} from 'react'
import PasswordChecklist from "react-password-checklist"
import { Helmet } from 'react-helmet'

import Navbar from './partials/navbar'
import Footer from './partials/footer'
import './home.css'
import '../index.css'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NativeSelect from '@mui/material/NativeSelect';
import { alpha, styled } from '@mui/material/styles';



const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'black',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black',
        },
        '&:hover fieldset': {
            borderColor: 'black',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
    },
});

function Register(){
    const [password, setPassword] = useState("")
    const [passwordAgain, setPasswordAgain] = useState("")
    const [form, setForm] = React.useState({firstName: '', lastName: '', email: '', role: '', password: '', confirmPassword: ''});

    function onChange(event) {
        const {name, value} = event.target;
        setForm(oldForm => ({...oldForm, [name]: value}))
    }

    function isValid() {
        const {firstName, lastName, email, role, password, confirmPassword} = form;
        return firstName.length>0 && lastName.length > 0 && password.length >= 8 && password == confirmPassword && /\S+@\S+\.\S+/.test(email) && role != 0;
    }

    function onSubmit(e) {
        e.preventDefault()
        alert("Tu trebas implementirat vezu frontenda i bekenda")
    }

    return (
            <div className="page-container">
                <Helmet>
                    <title>CuvariPasa | Registracija</title>
                </Helmet>

                <Navbar/>

                <div className="form-section-container ">
                    <div className="form-container background-citrus">

                        <Box
                            sx={{
                                padding: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography component="h1" variant="h5" className="text-blackolive">
                                Pridruži se!
                            </Typography>
                            <Box component="form"  sx={{mt: 3}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="Ime"
                                            onChange={onChange}
                                            value={form.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Prezime"
                                            name="lastName"
                                            onChange={onChange}
                                            value={form.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Adresa"
                                            name="email"
                                            onChange={onChange}
                                            value={form.email}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>

                                        <NativeSelect
                                            inputProps={{
                                                name: 'role',
                                                id: 'role',
                                            }}
                                            fullWidth
                                            required
                                            defaultValue={0}
                                            onChange={onChange}
                                            value={form.role}
                                        >
                                            <option value={0}>Odabir uloge</option>
                                            <option value={1}>Vlasnik</option>
                                            <option value={2}>Čuvar</option>
                                            <option value={3}>Vlasnik i čuvar</option>
                                        </NativeSelect>

                                    </Grid>

                                    <Grid item xs={12}>
                                        <StyledTextField
                                            required
                                            fullWidth
                                            onChange={e => {setPassword(e.target.value);onChange(e);}}
                                            name="password"
                                            label="Lozinka"
                                            type="password"
                                            id="password"
                                            value={form.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            required
                                            fullWidth
                                            onChange={e => {setPasswordAgain(e.target.value);onChange(e);}}
                                            name="confirmPassword"
                                            label="Potvrdi Lozinku"
                                            type="password"
                                            id="confirmPassword"
                                            value={form.confirmPassword}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <PasswordChecklist
                                            rules={["minLength","match"]}
                                            minLength={8}
                                            value={password}
                                            valueAgain={passwordAgain}
                                            onChange={(isValid) => {}}
                                            messages={{
                                                minLength: "Lozinka ima barem 8 znakova.",
                                                match: "Lozinke se podudaraju.",
                                            }}
                                        />
                                    </Grid>



                                    <Grid item xs={12}>
                                        <div className="form-button-container">
                                            <button
                                                type="submit"

                                                className="button button-primary"
                                                variant="contained"
                                                disabled={!isValid()}
                                                onClick={onSubmit}
                                            >
                                                Registracija
                                            </button>
                                        </div>
                                    </Grid>


                                </Grid>


                            </Box>
                        </Box>
                    </div>
                </div>
            </div>

        );

}

export default Register;
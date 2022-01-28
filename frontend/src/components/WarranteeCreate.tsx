import React, { useEffect } from "react";
import { makeStyles, Theme, createStyles, Container, Snackbar, Paper, Box, Typography, Divider, Grid, FormControl, TextField, Button, Select } from "@material-ui/core";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns"
import {Link as RouterLink} from "react-router-dom"

import { WarranteeInterface } from "../models/IWarrantee";
import { WorkReceiveInterface } from "../models/IWorkReceive";
import { WarranteeTypeInterface } from "../models/IWarranteeType";
import { EmployeeInterface } from "../models/IEmployee";
import NavBar from "./NavBar";


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props}/>
}

const useStyles = makeStyles((theme:Theme) => createStyles({
    root: {flexGrow: 1},
    container: {marginTop: theme.spacing(12)},
    paper: {padding: theme.spacing(2), 
    color: theme.palette.text.secondary},
}));

function WarranteeCreate() {
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
    
    const [warrantee, setWarrantee] = React.useState<Partial<WarranteeInterface>>({});
    const [workReceive, setWorkReceive] = React.useState<WorkReceiveInterface[]>([]);
    const [warranteeType, setWarranteeType] = React.useState<WarranteeTypeInterface[]>([]);
    const [employee, setEmployee] = React.useState<Partial<EmployeeInterface>>({});

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    const handleClose = (event?: React.SyntheticEvent, reson?: string) => {
        if(reson === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
        // window.location.reload();
    }

    const handleInputChange = (event: React.ChangeEvent<{name?: string; value: any}>) => {
        
        const name = event.target.name as keyof typeof warrantee;
        // console.log("name" , name)
        const { value } = event.target;
        // console.log(name, value)
        setWarrantee({...warrantee, [name]: value})
    }

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const apiUrl = "http://localhost:8080";

    const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };

    const getEmployee = async() => {
        const uid = localStorage.getItem("uid")
        fetch(`${apiUrl}/employee/${uid}`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if (res.data) {
              setEmployee(res.data);
            //   console.log(res.data.ID, res.data.Name, res.data.Email)
            }
            else {
              console.log("cannot get employee");
            }
          });
    };
    
    const getWorkReceive= async() => {   
        fetch(`${apiUrl}/work_receives`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if (res.data) {
              setWorkReceive(res.data);
            }
            else {
              console.log("cannot get work receive");
            }
          });
     };

    const getWarranteeType = async() => {

        fetch(`${apiUrl}/warrantee_types`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if (res.data) {
              setWarranteeType(res.data);
            }
            else {
              console.log("cannot get warrantee type");
            }
          });
     }; 

     useEffect(() => {
         getEmployee();
         getWorkReceive();
         getWarranteeType();
     }, [])

    const convertTypeInt = (data: string | number | undefined) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    }
    
    

    function submit() {
        let validWarranteePart = false;
        let validMaximumAmount = false;

        if (warrantee.WarranteeTypeID === undefined) {
            warrantee.WarranteeTypeID = warranteeType[0].ID;
        }
        if (warrantee.EmployeeID === undefined) {
            warrantee.EmployeeID = employee.ID;
        }
        if (warrantee.WorkReceiveID === undefined && workReceive.length !== 0) {
            warrantee.WorkReceiveID = workReceive[0].ID;
        }

        let data = {
            ID_Warrantee: warrantee.ID_Warrantee = "",
            EndOfWarrantee: selectedDate,
            WarrantyPart: warrantee.WarrantyPart,
            MaximumAmount: typeof warrantee.MaximumAmount === "string" ? parseFloat(warrantee.MaximumAmount) : undefined,
            
            WorkReceiveID: convertTypeInt(warrantee.WorkReceiveID),
            EmployeeID: convertTypeInt(warrantee.EmployeeID = employee.ID),
            WarranteeTypeID: convertTypeInt(warrantee.WarranteeTypeID),
        };
        // console.log(warrantee.EmployeeID, warrantee.WorkReceiveID, warrantee.WarranteeTypeID);

            console.log(warrantee.WarrantyPart !== undefined)
            console.log(warrantee.MaximumAmount !== undefined)
            if(warrantee.MaximumAmount !== undefined ) {
                validMaximumAmount = true
            }
            if(warrantee.WarrantyPart !== undefined) {
                validWarranteePart = true;
            }

            console.log(validMaximumAmount)
            console.log(validWarranteePart)

        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
              },
            body: JSON.stringify(data),
        };
        console.log(JSON.stringify(data));

        console.log(validMaximumAmount && validWarranteePart)

        if(validMaximumAmount && validWarranteePart) {
            fetch(`${apiUrl}/warrantee`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if(res.data) {
                    // console.log(res.data);
                    setSuccess(true);
                    window.location.reload();
                }
                else {
                    setError(true);
                }
            })
        }
        else {
            setError(true);
        }
    }

    return (
        <Container className={classes.container} maxWidth="md">
            <NavBar/>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อไม่มูลสำเร็จ
                </Alert>
            </Snackbar>

            <Paper className={classes.paper}>
                <Box display="flex">
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            Create Warrantee
                        </Typography>
                    </Box>
                </Box>

                <Divider/>
              
                    
                <Box paddingTop="3%">
                    <Grid container spacing={3} className={classes.root} alignItems="center">
                        <Grid item xs={6}>
                            <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                            align="center"
                            >
                            ผู้บันทึกข้อมูล
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    native
                                    name="Name"
                                    variant="outlined"
                                    value={employee.Name}
                                    onChange={handleInputChange}
                                    disabled
                                >
                                    <option value={employee.ID} key={employee.ID}>
                                        {employee.Name}
                                    </option>
                                
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid> 


                    <Grid container spacing={3} className={classes.root} alignItems="center">
                        <Grid item xs={6}>
                            <Typography
                                component="h2"
                                variant="h6"
                                color="primary"
                                gutterBottom
                                align="center"
                            >
                                งานที่ซ่อม
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    native
                                    name="WorkReceiveID"
                                    variant="outlined"                            
                                    value={warrantee.WorkReceiveID}
                                    onChange={handleInputChange}
                                    disabled={workReceive.length === 0 ? true:false}
                                >
                                    {workReceive.length === 0 ? (
                                        <option aria-label="None" value="">
                                            No Work Available
                                        </option>): <br/>}
                                    {workReceive.map((item: WorkReceiveInterface) => (
                                        <option value={item.ID} key={item.ID}>
                                            {item.WorkCode}
                                        </option>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
          
                    <Grid container spacing={3} className={classes.root} alignItems="center">
                        <Grid item xs={6}>
                            <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                            align="center"
                            >
                            รูปแบบการรับประกัน
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <FormControl fullWidth variant="outlined">

                                <Select
                                    native
                                    name="WarranteeTypeID"
                                    variant="outlined"                            
                                    value={warrantee.WarranteeTypeID}
                                    onChange={handleInputChange}
                                >

                                    {warranteeType.map((item: WarranteeTypeInterface) => (
                                        <option value={item.ID} key={item.ID}>
                                            {item.Description}
                                        </option>
                                    ))}
                                </Select>
                            
                            </FormControl>
                        </Grid>
                    </Grid>  
            
                    <Grid container spacing={3} className={classes.root} alignItems="center">
                        <Grid item xs={6}>
                            <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                            align="center"
                            >
                            อะไหล่ที่ประกันได้
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <FormControl fullWidth variant="outlined">

                                <TextField
                                    name="WarrantyPart"
                                    variant="outlined"
                                    type="string"
                                    size="medium" 
                                    multiline
                                    maxRows={2}                           
                                    value={warrantee.WarrantyPart || ""}
                                    onChange={handleInputChange}
                                />  
                            
                            </FormControl>
                        </Grid>
                    </Grid>  


                    <Grid container spacing={3} className={classes.root} alignItems="center">
                        <Grid item xs={6}>
                            <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                            align="center"
                            >
                            วงเงินสูงสุด
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <FormControl fullWidth variant="outlined">

                                <TextField
                                    name="MaximumAmount"
                                    variant="outlined"
                                    type="number"
                                    size="medium"
                                    value={warrantee.MaximumAmount || ""}
                                    onChange={handleInputChange}
                                />
                            
                            </FormControl>
                        </Grid>
                    </Grid>  


                    <Grid container spacing={3} className={classes.root} alignItems="center">
                        <Grid item xs={6} >
                            <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                            align="center"
                            >
                                วันที่หมดประกัน
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <Box paddingLeft="6%" paddingRight="6%">
                            <FormControl fullWidth variant="outlined">

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    name="EndOfWarrantee"
                                    format="yyyy-MM-dd"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                />
                            </MuiPickersUtilsProvider>

                            </FormControl>
                            </Box>
                        </Grid>    
                    </Grid>   

                    <Grid container spacing={3} className={classes.root}>
                        <Grid item xs={12}>
                            <Button component={RouterLink} to="/warrantee" variant="contained">
                                Back
                            </Button>
                            <Button
                                style={{float: "right"}}
                                onClick={submit}
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>         
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default WarranteeCreate;
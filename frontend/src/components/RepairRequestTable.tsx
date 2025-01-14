import React, { useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import Container from "@material-ui/core/Container";

import Paper from "@material-ui/core/Paper";

import Box from "@material-ui/core/Box";

import Table from "@material-ui/core/Table";

import TableBody from "@material-ui/core/TableBody";

import TableCell from "@material-ui/core/TableCell";

import TableContainer from "@material-ui/core/TableContainer";

import TableHead from "@material-ui/core/TableHead";

import TableRow from "@material-ui/core/TableRow";

import { RepairRequestsInterface } from "../models/IRepairRequest";

import { format } from 'date-fns'


import NavBar from "./NavBar";

const useStyles = makeStyles((theme: Theme) =>

  createStyles({

    container: { marginTop: theme.spacing(2) },

    table: { minWidth: 650 },

    tableSpace: { marginTop: 20 },

  })

);



function RepairRequestTable() {

  const classes = useStyles();

  const [RepairRequests, setRepairRequests] = React.useState<RepairRequestsInterface[]>([]);


  const apiUrl = "http://localhost:8080";

  const requestOptions = {

    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },

  };

  
  const getRepairRequests = async () => {
    fetch(`${apiUrl}/repair_requests`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setRepairRequests(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    
    getRepairRequests();

  }, []);



  return (
    <div>
      
      <Container className={classes.container} maxWidth="md">
      <NavBar />
      <Typography component="div" style={{ height: '13vh' }} />
        <Box display="flex">
          <Box flexGrow={1}>
          
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              รายการเเจ้งซ่อมของลูกค้า
              

            </Typography>
            
          </Box>
          
          <Box>
            <Button
              component={RouterLink}
              
              to="/RepairRequest"
              variant="contained"
              color="primary"
            >
              ร้องขอเเจ้งซ่อม
            </Button>
            </Box>
          
          
          
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="5%">
                  ลำดับ
                </TableCell>
                <TableCell align="center" width="20%">
                  ลูกค้า
                </TableCell>
                <TableCell align="center" width="10%">
                  ประเภทการเเจ้งซ่อม
                </TableCell>
                <TableCell align="center" width="10%">
                  ความเร่งด่วน
                </TableCell>
                <TableCell align="center" width="20%">
                  อุปกรณ์
                </TableCell>
                <TableCell align="center" width="10%">
                    อายุการใช้งาน (เดือน)
                </TableCell>
                <TableCell align="center" width="10%">
                 ปัญหา
                </TableCell>
                <TableCell align="center" width="15%">
                  วันที่และเวลา
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {RepairRequests.map((item: RepairRequestsInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center" >{item.ID}</TableCell>
                  <TableCell align="center" >{item.Customer.Name}</TableCell>
                  <TableCell align="center" >{item.RepairType.Name}</TableCell>
                  <TableCell align="center" >{item.Urgency.Name}</TableCell>
                  <TableCell align="center" >{item.Device}</TableCell>
                  <TableCell align="center" >{item.Lifetime}</TableCell>
                  <TableCell align="center" >{item.Issue}</TableCell>
                  <TableCell align="center" >{format((new Date(item.RequestDate)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default RepairRequestTable;
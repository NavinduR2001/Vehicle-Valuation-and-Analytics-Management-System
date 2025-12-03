import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, ButtonGroup } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
    marginRight: 0,
  },
}));

const vehicles = [
  {
    registrationNumber: "SP ABC-1234",
    assetType: "Car",
    make: "Toyota",
    model: "Corolla",
    engineNumber: "2NZ1234567",
    chassisNo: "JTDBR32E123456789",
    inspectionDate: "2024-05-12",
    inspectionPlace: "Colombo",
    firstRegistrationDate: "2018-03-20",
    engineCC: 1490,
    yom: 2018,
    fuelType: "Petrol",
    images: ["img1.jpg", "img2.jpg"],

    userDetails: {
      name: "Nimal Perera",
      company: "AutoCheck Lanka (Pvt) Ltd"
    },

    valuationDetails: {
      valuationDate: "2024-05-15",
      manager: "S. Wijesinghe",
      valuationPrice: 4850000
    }
  },

  {
    registrationNumber: "CP BGF-5678",
    assetType: "Motorcycle",
    make: "Honda",
    model: "Dio",
    engineNumber: "HND9876543",
    chassisNo: "ME4JF501JK123456",
    inspectionDate: "2024-02-10",
    inspectionPlace: "Kandy",
    firstRegistrationDate: "2020-11-05",
    engineCC: 110,
    yom: 2020,
    fuelType: "Petrol",
    images: ["img1.jpg", "img2.jpg"],

    userDetails: {
      name: "Kasun Lakshan",
      company: "RideSafe Valuations"
    },

    valuationDetails: {
      valuationDate: "2024-02-12",
      manager: "P. Bandara",
      valuationPrice: 235000
    }
  },

  {
    registrationNumber: "WP CBA-4321",
    assetType: "Car",
    make: "Nissan",
    model: "Leaf",
    engineNumber: "EV123456",
    chassisNo: "AZE0-123456",
    inspectionDate: "2024-01-15",
    inspectionPlace: "Gampaha",
    firstRegistrationDate: "2019-04-18",
    engineCC: 0,
    yom: 2019,
    fuelType: "Electric",
    images: ["img1.jpg", "img2.jpg", "img3.jpg"],

    userDetails: {
      name: "Dinithi Hansika",
      company: "GreenDrive Auto Solutions"
    },

    valuationDetails: {
      valuationDate: "2024-01-20",
      manager: "R. Jayawardena",
      valuationPrice: 7450000
    }
  },

  {
    registrationNumber: "SG KLM-9988",
    assetType: "Van",
    make: "Suzuki",
    model: "Every",
    engineNumber: "K6A789123",
    chassisNo: "DA17V-123456",
    inspectionDate: "2023-12-08",
    inspectionPlace: "Kurunegala",
    firstRegistrationDate: "2017-06-11",
    engineCC: 660,
    yom: 2017,
    fuelType: "Petrol",
    images: ["img1.jpg", "img2.jpg"],

    userDetails: {
      name: "Ruwan Madushanka",
      company: "Prime Vehicle Assessors"
    },

    valuationDetails: {
      valuationDate: "2023-12-10",
      manager: "Chaminda Silva",
      valuationPrice: 3200000
    }
  },

  {
    registrationNumber: "NC QWE-2456",
    assetType: "Three Wheeler",
    make: "Bajaj",
    model: "RE",
    engineNumber: "BJR554433",
    chassisNo: "MBLRE123XH1234567",
    inspectionDate: "2024-03-09",
    inspectionPlace: "Nuwara Eliya",
    firstRegistrationDate: "2021-01-22",
    engineCC: 198,
    yom: 2021,
    fuelType: "Petrol",
    images: ["img1.jpg", "img2.jpg", "img3.jpg"],

    userDetails: {
      name: "Sunil Rathnayake",
      company: "QuickValue Assessments"
    },

    valuationDetails: {
      valuationDate: "2024-03-11",
      manager: "Thilina Rathnayake",
      valuationPrice: 860000
    }
  },

  {
    registrationNumber: "EP GTR-7788",
    assetType: "SUV",
    make: "Mitsubishi",
    model: "Outlander",
    engineNumber: "4B11-123987",
    chassisNo: "JMBXTCW5ZJZ012345",
    inspectionDate: "2024-04-11",
    inspectionPlace: "Badulla",
    firstRegistrationDate: "2016-02-19",
    engineCC: 2000,
    yom: 2016,
    fuelType: "Hybrid",
    images: ["img1.jpg", "img2.jpg"],

    userDetails: {
      name: "Gayan Priyashan",
      company: "Lanka Auto Experts"
    },

    valuationDetails: {
      valuationDate: "2024-04-13",
      manager: "Malith Perera",
      valuationPrice: 8650000
    }
  },

  {
    registrationNumber: "WP PQR-5566",
    assetType: "Car",
    make: "Honda",
    model: "Fit",
    engineNumber: "L13B345678",
    chassisNo: "GP5-1234567",
    inspectionDate: "2024-01-20",
    inspectionPlace: "Colombo",
    firstRegistrationDate: "2019-09-12",
    engineCC: 1300,
    yom: 2019,
    fuelType: "Hybrid",
    images: ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"],

    userDetails: {
      name: "Tharaka Dilshan",
      company: "AutoPro Valuations"
    },

    valuationDetails: {
      valuationDate: "2024-01-22",
      manager: "Chathura Senanayake",
      valuationPrice: 6750000
    }
  },

  {
    registrationNumber: "TG XYZ-8899",
    assetType: "Lorry",
    make: "Isuzu",
    model: "Elf",
    engineNumber: "4JB1123456",
    chassisNo: "NKR85-123456",
    inspectionDate: "2024-03-01",
    inspectionPlace: "Trincomalee",
    firstRegistrationDate: "2015-07-16",
    engineCC: 3000,
    yom: 2015,
    fuelType: "Diesel",
    images: ["img1.jpg", "img2.jpg"],

    userDetails: {
      name: "Suresh Fernando",
      company: "HeavyAuto Evaluations"
    },

    valuationDetails: {
      valuationDate: "2024-03-04",
      manager: "I. Abeykoon",
      valuationPrice: 9200000
    }
  },

  {
    registrationNumber: "UP JKL-3344",
    assetType: "Motorcycle",
    make: "Yamaha",
    model: "FZ",
    engineNumber: "FZ123789",
    chassisNo: "ME1RG1521K1234567",
    inspectionDate: "2024-02-27",
    inspectionPlace: "Matara",
    firstRegistrationDate: "2022-08-09",
    engineCC: 150,
    yom: 2022,
    fuelType: "Petrol",
    images: ["img1.jpg", "img2.jpg", "img3.jpg"],

    userDetails: {
      name: "Sajith Pradeep",
      company: "RideMaster Valuation Center"
    },

    valuationDetails: {
      valuationDate: "2024-02-28",
      manager: "Pramuditha Silva",
      valuationPrice: 590000
    }
  },

  {
    registrationNumber: "WP ASD-1023",
    assetType: "Car",
    make: "Mazda",
    model: "Axela",
    engineNumber: "PEE3123456",
    chassisNo: "BM5FS-123456",
    inspectionDate: "2024-03-14",
    inspectionPlace: "Colombo",
    firstRegistrationDate: "2018-10-03",
    engineCC: 1500,
    yom: 2018,
    fuelType: "Petrol",
    images: ["img1.jpg", "img2.jpg"],

    userDetails: {
      name: "Janaka Amarasinghe",
      company: "TrustAuto Assessors"
    },

    valuationDetails: {
      valuationDate: "2024-03-16",
      manager: "Kelum Rathnayake",
      valuationPrice: 5350000
    }
  }
];

function AvailableTable() {
  return (
     <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead >
          <TableRow >
            <StyledTableCell>Reg No</StyledTableCell>
            <StyledTableCell align="left">Date</StyledTableCell>
            <StyledTableCell align="left">Company</StyledTableCell>
            <StyledTableCell align="left">User</StyledTableCell>
            <StyledTableCell align="left">Manager</StyledTableCell>
            <StyledTableCell align="left">Value(LKR)</StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingRight: 0, width:'fit-content' }}></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((row) => (
            <StyledTableRow key={row.registrationNumber}>
              <StyledTableCell align="left">{row.registrationNumber}</StyledTableCell>
              <StyledTableCell align="left">{row.valuationDetails.valuationDate}</StyledTableCell>
              <StyledTableCell align="left">{row.userDetails.company}</StyledTableCell>
              <StyledTableCell align="left">{row.userDetails.name}</StyledTableCell>
                <StyledTableCell align="left">{row.valuationDetails.manager}</StyledTableCell>
                <StyledTableCell align="left" sx={{fontWeight:'bold',color:'#990000'}}>{row.valuationDetails.valuationPrice}</StyledTableCell>
                <StyledTableCell align="center">
                    <ButtonGroup variant='contained' >
                    <Button variant="contained" color="primary" size="small" >
                      View 
                    </Button>
                    <Button variant="contained" color="primary" size="small" sx={{backgroundColor:'#44B172'}}>
                      Approve
                    </Button>
                    <Button variant="contained" color="primary" size="small" sx={{backgroundColor:'#D8003D'}}>
                      Reject
                    </Button>
                    </ButtonGroup>
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AvailableTable
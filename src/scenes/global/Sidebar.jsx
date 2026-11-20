import { useState } from "react";
import { ProSideBar, Menu, MenuItem } from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeModeOutLinedIcon from "@mui/icons-material/HomeModeOutLined"
import PeopleModeOutLinedIcon from "@mui/icons-material/PeopleModeOutLined"
import ContactsModeOutLinedIcon from "@mui/icons-material/ContactsModeOutLined"
import ReceiptModeOutLinedIcon from "@mui/icons-material/ReceiptModeOutLined"
import PersonModeOutLinedIcon from "@mui/icons-material/PersonModeOutLined"
import CalendarTodayModeOutLinedIcon from "@mui/icons-material/CalendarTodayModeOutLined"
import HelpOutLinedIcon from "@mui/icons-material/HelpOutLined"
import BarChartOutLinedIcon from "@mui/icons-material/BarChartOutLined"
import PieChartOutLinedIcon from "@mui/icons-material/PieChartOutLined"
import TimelineOutLinedIcon from "@mui/icons-material/TimelineOutLined"
import MenuOutLinedIcon from "@mui/icons-material/MenuOutLined"
import MapoutLinedIcon from "@mui/icons-material/MapOutLined"

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box 
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`
                },
                "& .pro-icon-wrapper": {
                    backgroundColor:"transparent !important" 
                },
                "& .pro-inner-item": {
                    padding : "5px 35px 5px 30px !important"
                },
                "& .pro-inner-item:hover": {
                    color: " #868dfb !important"
                },
                "& .pro-menu-item.active": {
                    color: " #6870fa !important"
                },
            }}> 
        <ProSidebar>
         <Menu>
            <MenuItem>
            
            </MenuItem>

            {/* USER */}
            {!isCollapsed && (
                <Box mb="25px">
                    <Box display="felx" justifyContent="center" alignItens="center">
                        <img 
                        alt="PROFILE-USER"
                        width="100px"
                        height="100px"
                        src={`../../assets/user.png`}
                        style={{ cursor: "pointer", borderRadius: "50%"}}
                        />
                    </Box>
                    <Box>
                        <Typography>Samuel Cardoso</Typography>
                        <Typography>VP Francy Admin</Typography>
                    </Box>
                </Box>
            )}
         </Menu>
        </ProSidebar>
        </Box>
    );
};

export default Sidebar; 
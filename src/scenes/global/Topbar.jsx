import { Box, IconButton, useTheme} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material";
import LightModeOutLinedIcon from "@mui/icons-material/LightModeOutlined"; 
import DarkModeOutLinedIcon from "@mui/icons-material/DarkModeOutlined"; 
import NotificationOutLinedIcon from "@mui/icons-material/LightModeOutlined"; 
import SettingsOutLinedIcon from "@mui/icons-material/LightModeOutlined"; 
import PersonOutLinedIcon from "@mui/icons-material/LightModeOutlined"; 
import SearchLightModeOutLinedIcon from "@mui/icons-material/LightModeOutlined"; 

function Topbar() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    

    return  <div>Topbar</div>

}

export default Topbar; 
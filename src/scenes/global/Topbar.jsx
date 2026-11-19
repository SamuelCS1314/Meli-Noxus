import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutLinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutLinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationOutLinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutLinedIcon from "@mui/icons-material/LightModeOutlined";
import PersonOutLinedIcon from "@mui/icons-material/LightModeOutlined";
import SearchIcon from "@mui/icons-material/Search";

function Topbar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-bettween" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICON BOX */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutLinedIcon />
          ) : (
            <LightModeOutLinedIcon />
          )}
          
        </IconButton>
        <IconButton>
          <NotificationOutLinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutLinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutLinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Topbar;

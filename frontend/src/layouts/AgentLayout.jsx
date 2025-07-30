import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AgentLayout() {
  return (
    <Box>
      Agent Layout
      <Outlet />
    </Box>
  )
}
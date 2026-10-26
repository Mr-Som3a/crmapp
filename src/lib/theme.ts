import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#6658f5" }, background: { default: "#0f1727", paper: "#1c2838" }, text: { primary: "#f5f7ff", secondary: "#95a9c4" }, divider: "#303e52" },
  typography: { fontFamily: "Arial, Helvetica, sans-serif", button: { textTransform: "none", fontWeight: 600 } },
  shape: { borderRadius: 12 },
  components: { MuiButton: { defaultProps: { disableElevation: true } }, MuiTextField: { defaultProps: { size: "small", fullWidth: true } }, MuiDialog: { styleOverrides: { paper: { backgroundImage: "none" } } } }
});

export default theme;

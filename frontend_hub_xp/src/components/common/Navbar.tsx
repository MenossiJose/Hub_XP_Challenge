import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Gerenciador de Loja
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/categories">
          Categorias
        </Button>
        <Button color="inherit" component={Link} to="/products">
          Produtos
        </Button>
        <Button color="inherit" component={Link} to="/orders">
          Pedidos
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

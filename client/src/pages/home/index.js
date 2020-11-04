import React, { Component, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import AppBar from "../../components/appbar";
import Upload from "../../components/upload";
import {
  getAllFiles,
  uploadFile,
  login,
  register,
  deleteFile,
} from "../../actions/files";
import DataTable from "../../components/DataTable";
import { TableRow, TableCell } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    height: "100vh",
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
});

function FormDialog({ open, handleClose }) {
  const [isLogin, setLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = () => {
    if (isLogin) {
      login({ email, password }).finally(handleClose);
    } else {
      register({ email, name, password }).finally(handleClose);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {isLogin ? "Login" : "Register"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isLogin ? "Login" : "Register"} to Use application
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin ? (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          ""
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>

        <Button onClick={() => setLogin(!isLogin)} color="primary">
          {isLogin ? " Create Account" : "Already have Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      open: false,
      message: "",
      openDialog: !localStorage.getItem("TOKEN"),
    };
    // this.uploadFile = this.uploadFile.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getFiles = this.getFiles.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.renderFunc = this.renderFunc.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }
  handleClose() {
    this.setState({
      open: false,
    });
  }
  getFiles() {
    getAllFiles()
      .then((files) => {
        this.setState({
          files,
        });
      })
      .catch((error) =>
        this.setState({
          open: true,
          variant: "error",
          message: error.msg || "Error while getting files",
        })
      );
  }

  componentDidMount() {
    this.getFiles();
  }
  renderFunc(row, index) {
    return (
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          <a
            href={`https://freechargedemo.herokuapp.com/api/file/${row._id}`}
            targe="blank"
          >
            Open
          </a>
        </TableCell>
        <TableCell>
          <Button
            onClick={() => {
              deleteFile(row._id)
                .then(() => this.getFiles())
                .catch((error) => {
                  this.setState({
                    open: true,
                    variant: "error",
                    message: error.message || "Error while getting files",
                  });
                });
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  uploadFile() {
    if (!localStorage.getItem("TOKEN")) {
      this.setState({ openDialog: true });
      return;
    } else {
      this.setState({ openDialog: false });
    }
    uploadFile().then(() => {
      this.setState({
        open: true,
        variant: "success",
        message: "File Uploaded",
      });
      this.getFiles();
    });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false });
  }
  render() {
    return (
      <div>
        <FormDialog
          open={this.state.openDialog}
          handleClose={this.handleCloseDialog}
        />
        <AppBar />
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <Upload uploadFile={this.uploadFile} text={this.state.credits} />
          </Grid>
          <Grid item xs={9}>
            <DataTable
              data={this.state.files}
              renderFunc={this.renderFunc}
              headers={["S.no", "Link", "Open", "Action"]}
            />
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            onClose={this.handleClose}
            message={<span>{this.state.message}</span>}
          />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(Home);

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    height: "50vh",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
  },
  table: {
    minWidth: 700,
  },
});

function UploadBox(props) {
  const { classes, uploadFile, text } = props;
  return (
    <div>
      <Paper className={classes.root}>
        <input
          accept="*"
          className={classes.input}
          id="file"
          multiple
          type="file"
          onChange={uploadFile}
          hidden
        />
        <label htmlFor="file">
          <Button
            variant="contained"
            component="span"
            className={classes.button}
          >
            Upload
          </Button>
        </label>
      </Paper>
    </div>
  );
}

UploadBox.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(UploadBox);

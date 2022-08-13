import { Fragment, MouseEventHandler, useEffect, useState } from "react";
import { Button, ButtonGroup, Grid, Menu, MenuItem } from "@mui/material";
import { endpoint } from "@/main";
import { ProblemType } from "@/App";

interface ProblemProps {
  pkey: string;
  success: number;
  fail: number;
  name: string;
  onenote_url: string;
}

type colors = "primary" | "success" | "error" | "warning"

export function Problem(props: ProblemProps): JSX.Element {
  const { pkey, name, onenote_url } = props;

  const [success, setSuccess] = useState(props.success);
  const [fail, setFail] = useState(props.fail);

  const [color, setColor] = useState<colors>("primary");

  useEffect(() => {
    if (success > 0) {
      setColor("success");
    } else if (fail > 0) {
      setColor("error");
    } else {
      setColor("primary");
    }
  }, [success, fail]);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
  } | null>(null);

  const handleContextMenu: MouseEventHandler = event => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6
        }
        : null
    );
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  function handleSuccessClick() {
    fetch(`${endpoint}/success/${pkey}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then((data: ProblemType) => {
        setSuccess(data.success);
        setFail(data.fail);
      });
  }

  function handleFailClick() {
    fetch(`${endpoint}/fail/${pkey}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then((data: ProblemType) => {
        setSuccess(data.success);
        setFail(data.fail);
      });
  }

  function handleReset() {
    setContextMenu(null);
    fetch(`${endpoint}/reset/${pkey}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then((data: ProblemType) => {
        setSuccess(data.success);
        setFail(data.fail);
      });
  }

  return (
    <Fragment>
      <Grid
        item
        xs={4}
        md={3}
        onContextMenu={handleContextMenu}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "context-menu"
        }}
      >
        <ButtonGroup variant="contained">
          <Button
            color={color}
            onClick={() => {
              window.open(onenote_url, "_blank");
            }}
          >
            {name}
          </Button>
          <Button variant={"outlined"} color={color} onClick={handleSuccessClick}>
            {success}
          </Button>
          <Button variant={"outlined"} color={color} onClick={handleFailClick}>
            {fail}
          </Button>
        </ButtonGroup>
      </Grid>
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem onClick={handleReset}>Reset</MenuItem>
      </Menu>
    </Fragment>
  );
}

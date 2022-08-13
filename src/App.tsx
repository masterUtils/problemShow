import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  styled,
  TextField,
  Typography
} from "@mui/material";
import { endpoint } from "@/main";
import { useBoolean, useKey } from "react-use";
import { Problem } from "./Problem";

export type ProblemType = {
  success: number
  fail: number
  name: string
  onenote_url: string
}
type ProblemResponse = {
  [key: string]: ProblemType
}

const App: FC = () => {
  const [problem, setProblem] = useState<ProblemResponse>({});
  const [section, setSection] = useState<string | null>(null);
  const [loading, setLoading] = useBoolean(false);

  const [open, setOpen] = useBoolean(false);

  let inputBuffer = "";

  useKey(
    ev => {
      if (ev.ctrlKey && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        return true;
      }
      return false;
    },
    () => {
      setOpen(true);
    }
  );

  useEffect(() => {
    const spSection = new URLSearchParams(window.location.search).get("s");

    if (spSection) {
      setSection(spSection);
    } else {
      setSection("");
    }
  }, []);

  useEffect(() => {
    if (section && !open) {
      setLoading(true);
      setProblem({});
      fetch(`${endpoint}/stats/_/${section}.json`)
        .then(res => res.json())
        .then(setProblem)
        .catch((e) => {
          console.warn(e);
          console.warn("Failed to fetch problem");
        }).finally(
        () => {
          setLoading(false);
        }
      );
    }
  }, [section, open, setLoading]);

  useEffect(() => {
    if (section !== null) {
      const url = new URL(window.location.href);
      if (section !== "") {
        url.searchParams.set("s", section);
      }
      window.history.pushState({}, "", url.toString());
    }
  }, [section]);

  function handleDialogClose() {
    setSection(inputBuffer);
    setOpen(false);
  }

  function dialogOnChange(ev: ChangeEvent<HTMLInputElement>) {
    inputBuffer = ev.target.value;
  }

  const showTips = Object.keys(problem).length === 0 && !loading;

  return (
    <Container
      style={{
        marginTop: "3rem",
        marginBottom: "3rem"
      }}
    >
      <Root>
        <CssBaseline />
        <Dialog
          open={open}
          onClose={handleDialogClose}
          maxWidth={"md"}
          style={{
            minWidth: "500px"
          }}
        >
          <DialogTitle>Section Prefix</DialogTitle>
          <DialogContent>
            <DialogContentText>Set Section ID</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Section id"
              type="text"
              onChange={dialogOnChange}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleDialogClose}>Save</Button>
          </DialogActions>
        </Dialog>
        {(!showTips) && (<Grid container spacing={2}>
          {Object.entries(problem)
            .sort(([ak], [bk]) => {
              const aValue = parseInt(ak.split("-")[1]);
              const bValue = parseInt(bk.split("-")[1]);
              return aValue - bValue;
            })
            .map(([pkey, p]) => {
              const { success, fail, name, onenote_url } = p;
              return (
                <Problem key={pkey} pkey={pkey} success={success} fail={fail} name={name} onenote_url={onenote_url} />
              );
            })}
        </Grid>)}
        {showTips && (
          <div style={{
            textAlign: "center"
          }}>
            {section && (
              <Typography variant={"h3"}>
                {section} has no valid data.
              </Typography>
            )}
            {!section && (
              <Typography variant={"h3"}>
                No section id set.
              </Typography>
            )}
            <Typography variant={"h3"}>
              Click Ctrl+K to open the setting dialog.
            </Typography>
          </div>
        )}
      </Root>
    </Container>
  );
};

const Root = styled("div")`
  width: 100%;
  min-height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;

  & a {
    text-decoration: none;
    color: ${({ theme: { palette } }) => palette.primary.main};
  }
`;

export default App;

import { ChangeEvent, FC, useEffect, useState } from 'react'
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
  TextField
} from '@mui/material'
import { endpoint } from '@/main'
import { useKey, useLocalStorage } from 'react-use'
import { Problem } from './Problem'

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
  const [problem, setProblem] = useState<ProblemResponse>({})
  const [section, setSection] = useLocalStorage('section', '')

  const [open, setOpen] = useState(false)

  useKey(
    ev => {
      if (ev.ctrlKey && ev.key.toLowerCase() === 'k') {
        ev.preventDefault()
        return true
      }
      return false
    },
    () => {
      setOpen(true)
    }
  )

  useEffect(() => {
    if (section && !open) {
      fetch(`${endpoint}/stats/_/${section}.json`)
        .then(res => res.json())
        .then(setProblem)
    }
  }, [section, open])

  function handleDialogClose() {
    setOpen(false)
  }

  function dialogOnChange(ev: ChangeEvent<HTMLInputElement>) {
    setSection(ev.target.value)
  }

  return (
    <Container
      style={{
        marginTop: '3rem',
        marginBottom: '3rem'
      }}
    >
      <Root>
        <CssBaseline />
        <Dialog
          open={open}
          onClose={handleDialogClose}
          maxWidth={'md'}
          style={{
            minWidth: '500px'
          }}
        >
          <DialogTitle>Section Prefix</DialogTitle>
          <DialogContent>
            <DialogContentText>Set Section ID</DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              label='Section id'
              type='text'
              onChange={dialogOnChange}
              variant='standard'
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleDialogClose}>Save</Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={2}>
          {Object.entries(problem)
            .sort(([ak], [bk]) => {
              const aValue = parseInt(ak.split('-')[1])
              const bValue = parseInt(bk.split('-')[1])
              return aValue - bValue
            })
            .map(([pkey, p]) => {
              const { success, fail, name, onenote_url } = p
              return (
                <Problem key={pkey} pkey={pkey} success={success} fail={fail} name={name} onenote_url={onenote_url} />
              )
            })}
        </Grid>
      </Root>
    </Container>
  )
}

const Root = styled('div')`
  width: 100%;
  min-height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;

  & a {
    text-decoration: none;
    color: ${({ theme: { palette } }) => palette.primary.main};
  }
`

export default App

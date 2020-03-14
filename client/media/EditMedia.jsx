import React, { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"

import { 
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import auth from "./../auth/auth-helper"
import { read, update } from "./api-media.js"

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 500,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  filename: {
    marginLeft: '10px'
  }
}))

export default function EditProfile({ match }) {
  const classes = useStyles()
  const [media, setMedia] = useState({ title: "", description: "", genre: "" })
  const [redirect, setRedirect] = useState(false)
  const [error, setError] = useState("")
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ mediaId: match.params.mediaId }).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setMedia(data)
      }
    })
    return () => {
      abortController.abort()
    }
  }, [match.params.mediaId])

  const handleSubmit = () => {
    const jwt = auth.isAuthenticated()
    update({
      mediaId: media._id
    }, {
      t: jwt.token
    }, media).then( data => {
      if (data.error) {
        setError(data.error)
      } else {
        setRedirect(true)
      }
    })
  }

  const handleChange = name => event => {
    let updatedMedia = { ...media }
    updatedMedia[name] = event.target.value
    setMedia(updatedMedia)
  }

  if (redirect) {
    return (<Redirect to={"/media/" + media._id} />)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography type="headline" component="h1" className={classes.title}>
          Edit Video Details
        </Typography>

        <TextField 
          id="title" 
          label="Title" 
          className={classes.textField} 
          value={media.title} 
          onChange={handleChange("title")} 
          margin="normal" 
        />
        <br />

        <TextField
          id="multiline-flexible"
          label="Description"
          multiline
          rows="2"
          value={media.description}
          onChange={handleChange('description')}
          className={classes.textField}
          margin="normal"
        />
        <br />

        <TextField 
          id="genre" 
          label="Genre" 
          className={classes.textField} 
          value={media.genre} 
          onChange={handleChange("genre")} 
          margin="normal" 
        />
        <br />

        {error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {error}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button 
          color="primary" 
          variant="contained" 
          onClick={handleSubmit} 
          className={classes.submit}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  )
}
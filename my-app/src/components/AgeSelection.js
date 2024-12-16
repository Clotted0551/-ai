import React from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { WorkOutlineOutlined, Person, ElderlyWoman } from '@mui/icons-material'

const AgeSelection = ({ onSelect }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {[
        { label: '청년층', icon: Person },
        { label: '중년층', icon: WorkOutlineOutlined },
        { label: '장년층', icon: ElderlyWoman }
      ].map(({ label, icon: Icon }) => (
        <Grid item key={label}>
          <Button
            variant="outlined"
            onClick={() => onSelect(label)}
            sx={{
              width: 120,
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">{label}</Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}

export default AgeSelection


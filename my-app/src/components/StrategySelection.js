import React from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { TrendingUp, Shield } from '@mui/icons-material'

const StrategySelection = ({ onSelect }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {[
        { label: '공격적', icon: TrendingUp },
        { label: '수비적', icon: Shield }
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

export default StrategySelection


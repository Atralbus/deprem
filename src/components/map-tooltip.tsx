/* eslint-disable react/jsx-key */
import { Datum } from '@/constants'
import { Map, WhatsApp } from '@mui/icons-material'
import { Button, Link, Stack, Typography } from '@mui/material'
import { InfoWindow } from '@react-google-maps/api'
import { format } from 'date-fns'
import { FC, useCallback } from 'react'
import { getDateWithoutOffset, getMapsUrl } from '../utils'

type Props = {
  tooltipRow: Datum
  setTooltipRow: (tooltipRow?: Datum) => void
}

const MapTooltip: FC<Props> = ({ tooltipRow, setTooltipRow }) => {
  const getLabel = useCallback(
    (key: keyof Datum, value: string | number | string[]) => {
      switch (key) {
        case 'URL':
          return (
            <Link href={value as string} target="_blank" rel="noreferrer">
              {value}
            </Link>
          )
        case 'Tarih':
          return format(
            getDateWithoutOffset(value as any),
            'dd/MM/yyyy HH:mm:ss',
          )
        case 'Telefon no': {
          if (!value) return '-'
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Link href={`tel:${value}`}>{value}</Link>
              <Button
                size="small"
                component={Link}
                href={`https://wa.me/${value}`}
                target="_blank"
                rel="noreferrer"
                color="success"
                variant="contained"
                startIcon={<WhatsApp />}
              >
                WhatsApp
              </Button>
            </Stack>
          )
        }
        case 'Kategori':
          return Array.isArray(value) ? value.join(', ') : value
        default:
          return value
      }
    },
    [],
  )

  return (
    <InfoWindow
      position={{ lat: tooltipRow.Enlem, lng: tooltipRow.Boylam }}
      options={{
        pixelOffset: { height: -20, equals: () => true, width: 0 },
      }}
      onCloseClick={() => setTooltipRow(undefined)}
    >
      <Stack spacing={1} sx={{ wordBreak: 'break-word' }}>
        {Object.entries(tooltipRow).map(([key, value]) => (
          <div>
            <Typography variant="subtitle2" component="div">
              {key}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              <>{getLabel(key as keyof Datum, value)}</>
            </Typography>
          </div>
        ))}
        <div>
          <Typography variant="subtitle2" component="div">
            Google Haritalar'da aç
          </Typography>
          <Typography color="text.secondary" variant="body2">
            <Button
              size="small"
              component={Link}
              href={getMapsUrl(tooltipRow.Enlem, tooltipRow.Boylam)}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              startIcon={<Map />}
            >
              Google Haritalar'da aç
            </Button>
          </Typography>
        </div>
      </Stack>
    </InfoWindow>
  )
}

export default MapTooltip

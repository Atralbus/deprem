import { Clear, DeleteOutline, FilterList, GitHub } from "@mui/icons-material";
import {
  Box,
  capitalize,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { FC, useState } from "react";
import { cities as cityOptions, City, jsonUrl, xlsxUrl } from "./constants";

export enum Hour {
  H1 = "1",
  H2 = "2",
  H4 = "4",
  H8 = "8",
}

type Props = {
  hour: Hour | null;
  onHourFilter: (newHour: Hour | null) => void;
  onCityFilter: (event: SelectChangeEvent<typeof cityOptions>) => void;
  cities: City[];
  lastUpdatedDate?: string;
};

const Filters: FC<Props> = ({
  hour,
  onHourFilter,
  onCityFilter,
  cities,
  lastUpdatedDate,
}) => {
  const [closed, setClosed] = useState(false);

  return (
    <Box position="absolute" top={60} left={10}>
      <Paper sx={{ p: closed ? 0.5 : 2 }}>
        <Tooltip title={closed ? "Filtreleri aç" : ""} enterDelay={500}>
          <IconButton
            size="small"
            onClick={() => setClosed((closed) => !closed)}
            sx={closed ? undefined : { position: "absolute", right: 8, top: 8 }}
          >
            {closed ? <FilterList /> : <Clear />}
          </IconButton>
        </Tooltip>
        {!closed && (
          <>
            <Typography variant="h6" pb={1}>
              Filtrele
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Son</Typography>
                <ToggleButtonGroup
                  exclusive
                  value={hour}
                  onChange={(_, newHour) => onHourFilter(newHour)}
                  size="small"
                >
                  {Object.values(Hour).map((hour) => (
                    <ToggleButton value={hour}>{hour} saat</ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Tooltip title="Filtreyi kaldır">
                  <IconButton onClick={() => onHourFilter(null)}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Stack>
              <FormControl fullWidth size="small">
                <InputLabel>Şehirler</InputLabel>
                <Select
                  multiple
                  value={cities}
                  onChange={onCityFilter}
                  input={<OutlinedInput label="Şehirler" />}
                >
                  {cityOptions.map((city) => (
                    <MenuItem key={city} value={city}>
                      {capitalize(city)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack spacing={1} direction="row">
                  <Typography>Veri kaynağı: </Typography>
                  <Link href={xlsxUrl} target="_blank" rel="noreferrer">
                    Excel
                  </Link>
                  <Link href={jsonUrl} target="_blank" rel="noreferrer">
                    JSON
                  </Link>
                </Stack>

                <Tooltip title="Teknik iletişim">
                  <IconButton
                    component={Link}
                    href="https://github.com/Atralbus/deprem"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitHub />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack>
                <Typography>
                  Son güncellenme:{" "}
                  {lastUpdatedDate
                    ? format(new Date(lastUpdatedDate), "dd/MM/yyyy HH:mm:ss")
                    : ""}
                </Typography>
              </Stack>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Filters;

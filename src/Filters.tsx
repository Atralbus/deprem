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
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { format } from "date-fns";
import { FC, useState } from "react";
import {
  categoryOptions,
  cities as cityOptions,
  City,
  jsonUrl,
  xlsxUrl,
} from "./constants";

export enum Hour {
  H1 = "1",
  H2 = "2",
  H4 = "4",
  H8 = "8",
}

type Props = {
  hour: Hour | null;
  onHourFilter: (newHour: Hour | null) => void;
  onCityFilter: (city: string | City[]) => void;
  cities: City[];
  lastUpdatedDate?: string;
  categories: string[];
  onCategoryFilter: (category: string | string[]) => void;
  numberOfRowsDisplayed: number;
};

const Filters: FC<Props> = ({
  hour,
  onHourFilter,
  onCityFilter,
  cities,
  lastUpdatedDate,
  categories,
  onCategoryFilter,
  numberOfRowsDisplayed,
}) => {
  const [closed, setClosed] = useState(false);

  return (
    <Box position="absolute" top={60} left={10} maxWidth="100%">
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
              <Typography color="textSecondary">
                {numberOfRowsDisplayed} adet bildirim görüntüleniyor.
              </Typography>
              <Grid2
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid2 container spacing={1} alignItems="center">
                  <Grid2>
                    <Typography>Son</Typography>
                  </Grid2>
                  <Grid2>
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
                  </Grid2>
                </Grid2>
                <Grid2>
                  <Tooltip title="Filtreyi kaldır">
                    <IconButton onClick={() => onHourFilter(null)}>
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </Grid2>
              </Grid2>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FormControl fullWidth size="small">
                  <InputLabel>Şehirler</InputLabel>
                  <Select
                    multiple
                    value={cities}
                    onChange={(event) => onCityFilter(event.target.value)}
                    input={<OutlinedInput label="Şehirler" />}
                  >
                    {cityOptions.map((city) => (
                      <MenuItem key={city} value={city}>
                        {capitalize(city)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Tooltip title="Filtreyi kaldır">
                  <IconButton onClick={() => onCityFilter([])}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FormControl fullWidth size="small">
                  <InputLabel>Kategoriler</InputLabel>
                  <Select
                    multiple
                    value={categories}
                    onChange={(event) => onCategoryFilter(event.target.value)}
                    input={<OutlinedInput label="Kategoriler" />}
                  >
                    {categoryOptions.map((category) => (
                      <MenuItem key={category} value={category}>
                        {capitalize(category)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Tooltip title="Filtreyi kaldır">
                  <IconButton onClick={() => onCategoryFilter([])}>
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Stack>
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

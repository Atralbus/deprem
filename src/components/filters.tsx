import { Clear, DeleteOutline, FilterList } from "@mui/icons-material";
import {
  Box,
  capitalize,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import { format } from "date-fns";
import { FC, useState } from "react";
import {
  Category,
  categoryOptions,
  cities as cityOptions,
  City,
  Hour,
} from "../constants";

type Props = {
  hour: Hour | null;
  onHourFilter: (newHour: Hour | null) => void;
  onCityFilter: (city: string | City[]) => void;
  cities: City[];
  lastUpdatedDate?: string;
  categories: Category[];
  onCategoryFilter: (category: string | Category[]) => void;
  numberOfRowsDisplayed: number;
  isHeatmapDisplayed: boolean;
  setHeatmapDisplayed: (show: boolean) => void;
  isMarkersDisplayed: boolean;
  setMarkersDisplayed: (show: boolean) => void;
  isClusteringEnabled: boolean;
  setClusteringEnabled: (show: boolean) => void;
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
  isHeatmapDisplayed,
  setHeatmapDisplayed,
  isMarkersDisplayed,
  setMarkersDisplayed,
  isClusteringEnabled,
  setClusteringEnabled,
}) => {
  const [closed, setClosed] = useState(false);

  return (
    <Box position="absolute" top={60} left={10} maxWidth="96%">
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
                {numberOfRowsDisplayed} bildirim görüntüleniyor.
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
                        <ToggleButton key={hour} value={hour}>
                          {hour} saat
                        </ToggleButton>
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
              <Stack>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isHeatmapDisplayed}
                      onChange={(event) =>
                        setHeatmapDisplayed(event.target.checked)
                      }
                    />
                  }
                  label="Yoğunluk haritası göster"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isMarkersDisplayed}
                      onChange={(event) =>
                        setMarkersDisplayed(event.target.checked)
                      }
                    />
                  }
                  label="İşaretçileri göster"
                />
                {isMarkersDisplayed && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isClusteringEnabled}
                        onChange={(event) =>
                          setClusteringEnabled(event.target.checked)
                        }
                      />
                    }
                    label="İşaretçileri kümele"
                  />
                )}
              </Stack>
              <Divider />
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

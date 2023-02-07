import { Clear, ExpandMore, FilterList } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  Box,
  IconButton,
  Link,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { FC, useState } from "react";

enum Hour {
  H1 = "1",
  H2 = "2",
  H4 = "4",
  H8 = "8",
}

type Props = {
  hour: Hour | null;
  onHourFilter: (
    event: React.MouseEvent<HTMLElement>,
    newHour: Hour | null
  ) => void;
};

const Filters: FC<Props> = ({ hour, onHourFilter }) => {
  const [closed, setClosed] = useState(false);

  return (
    <Box position="absolute" top={60} left={10}>
      <Paper sx={{ p: closed ? 0.5 : 2 }}>
        <Grid2
          container
          direction="row-reverse"
          onClick={() => setClosed((closed) => !closed)}
        >
          <Grid2>
            <Tooltip title={closed ? "Filtreleri aç" : ""} enterDelay={500}>
              <IconButton size="small">
                {closed ? <FilterList /> : <Clear />}
              </IconButton>
            </Tooltip>
          </Grid2>
        </Grid2>
        {!closed && (
          <>
            <Typography variant="h6" pb={1}>
              Filtrele
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Son</Typography>
              <ToggleButtonGroup
                exclusive
                value={hour}
                onChange={onHourFilter}
                size="small"
              >
                {Object.values(Hour).map((hour) => (
                  <ToggleButton value={hour}>{hour} saat</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            <Box mt={1}>
              <Link
                href="https://storage.googleapis.com/deprem-app-bucket/database.json"
                target="_blank"
              >
                Veri kaynağı
              </Link>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Filters;

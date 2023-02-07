import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";
import { format, isBefore, sub } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MAPS_API_KEY } from "./config";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 36.908453,
  lng: 36.640183,
};

const map = {
  hatay: "yellow",
  kahramanmaraş: "blue",
  adıyaman: "green",
  malatya: "ltblue",
  gaziantep: "orange",
  diyarbakır: "pink",
  osmaniye: "purple",
  elazığ: "red",
};

enum Hour {
  H1 = "1",
  H2 = "2",
  H4 = "4",
  H8 = "8",
}

const fetchRows = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "https://storage.googleapis.com/deprem-app-bucket/database.json",
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

function App() {
  const [data, setData] = useState<any[]>([]);
  const [tooltipRow, setTooltipRow] = useState<
    {
      Enlem: number;
      Boylam: number;
      "Google Maps URL": string;
    } & any
  >();
  const [hour, setHour] = useState<Hour | null>(null);

  useEffect(() => {
    fetchRows().then((data) => {
      setData(data);
    });
  }, []);

  const handleHourFilter = (
    event: React.MouseEvent<HTMLElement>,
    newHour: Hour | null
  ) => {
    setHour(newHour);
  };

  const filtered = useMemo(() => {
    if (!hour) return data;

    const startHour = sub(new Date(), { hours: +hour });
    const filteredRows = data.filter((row) => {
      return isBefore(startHour, new Date(row.Tarih));
    });
    return filteredRows;
  }, [hour, data]);

  const markers = useMemo(
    () =>
      filtered.map((row) => (
        <Marker
          key={row.URL}
          position={{ lat: row.Enlem, lng: row.Boylam }}
          onClick={() => setTooltipRow(row)}
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${
              map[row.Şehir as keyof typeof map]
            }-dot.png`,
          }}
        ></Marker>
      )),
    [filtered]
  );
  return (
    <>
      <LoadScript googleMapsApiKey={MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={10}
          center={center}
          onClick={() => setTooltipRow(undefined)}
        >
          {markers}
          {tooltipRow && (
            <InfoWindow
              position={{ lat: tooltipRow.Enlem, lng: tooltipRow.Boylam }}
              options={{
                pixelOffset: { height: -20, equals: () => true, width: 0 },
              }}
            >
              <div>
                {Object.entries(tooltipRow).map(([key, value]) => (
                  <>
                    <Typography variant="subtitle2" component="div">
                      {key}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      <>
                        {key !== "Tarih" && (
                          <>
                            {value}
                            <br />
                          </>
                        )}
                        {key === "Google Maps URL" && (
                          <a
                            href={value as string}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Google Haritalar'da ac
                          </a>
                        )}
                        {key === "Tarih" &&
                          format(new Date(value as any), "dd/MM/yyyy HH:mm:ss")}
                      </>
                    </Typography>
                  </>
                ))}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      <Box position="absolute" top={90} left={10}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Filtrele</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Son</Typography>
              <ToggleButtonGroup
                exclusive
                value={hour}
                onChange={handleHourFilter}
                size="small"
              >
                {Object.values(Hour).map((hour) => (
                  <ToggleButton value={hour}>{hour} saat</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
}

export default App;

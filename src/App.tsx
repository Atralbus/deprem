import { Backdrop, CircularProgress, SelectChangeEvent } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { isBefore, sub } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MAPS_API_KEY } from "./config";
import { City, colorMap, jsonUrl } from "./constants";
import Filters, { Hour } from "./Filters";
import Tooltip from "./Tooltip";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 36.908453,
  lng: 36.640183,
};

const fetchRows = async (): Promise<any> => {
  try {
    const response = await axios.get(jsonUrl, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

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
  const [hour, setHour] = useState<Hour | null>(Hour.H8);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setLoading] = useState(false);

  console.log(`data: `, data[0]);

  useEffect(() => {
    setLoading(true);
    fetchRows()
      .then((data) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleHourFilter = (
    event: React.MouseEvent<HTMLElement>,
    newHour: Hour | null
  ) => {
    setHour(newHour);
  };

  const filtered = useMemo(() => {
    if (!hour && !cities.length) return data;

    const startHour = hour ? sub(new Date(), { hours: +hour }) : new Date();
    const filteredRows = data.filter((row) => {
      return (
        (!hour || isBefore(startHour, new Date(row.Tarih))) &&
        (!cities.length || cities.includes(row.Şehir))
      );
    });
    return filteredRows;
  }, [hour, data, cities]);

  const markers = useMemo(
    () =>
      filtered.map((row) => (
        <Marker
          key={row.URL}
          position={{ lat: row.Enlem, lng: row.Boylam }}
          onClick={() => setTooltipRow(row)}
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${
              colorMap[row.Şehir as keyof typeof colorMap]
            }-dot.png`,
          }}
        ></Marker>
      )),
    [filtered]
  );

  const handleCityFilter = (event: SelectChangeEvent<typeof cities>) => {
    const {
      target: { value },
    } = event;
    setCities(typeof value === "string" ? (value.split(",") as City[]) : value);
  };

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
          {tooltipRow && <Tooltip tooltipRow={tooltipRow} />}
        </GoogleMap>
      </LoadScript>
      <Backdrop open={isLoading}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Backdrop>
      {!isLoading && (
        <Filters
          onHourFilter={handleHourFilter}
          hour={hour}
          onCityFilter={handleCityFilter}
          cities={cities}
          lastUpdatedDate={data[0]?.Tarih}
        />
      )}
    </>
  );
}

export default App;

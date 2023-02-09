import { Backdrop, CircularProgress } from "@mui/material";
import {
  GoogleMap,
  HeatmapLayer,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import axios, { AxiosResponse } from "axios";
import { isBefore, sub } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MAPS_API_KEY } from "./config";
import { City, colorMap, jsonUrl } from "./constants";
import Filters, { Hour } from "./Filters";
import Tooltip from "./Tooltip";
import { getDateWithoutOffset } from "./utils";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 36.908453,
  lng: 36.640183,
};

const libraries = ["visualization"] as const;

const fetchRows = async (): Promise<AxiosResponse<any, any> | undefined> => {
  try {
    const response = await axios.get(`${jsonUrl}?ts=${Date.now()}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return undefined;
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
  const [lastUpdatedDate, setLastModifiedDate] = useState<string>();
  const [categories, setCategories] = useState<string[]>([]);
  const [isHeatmapDisplayed, setHeatmapDisplayed] = useState(true);
  const [isMarkersDisplayed, setMarkersDisplayed] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRows()
      .then((response) => {
        if (!response) return;
        setData(response.data);
        setLastModifiedDate(response.headers["last-modified"]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setTooltipRow(undefined);
  }, [cities, hour]);

  const handleHourFilter = (newHour: Hour | null) => {
    setHour(newHour);
  };

  const filtered = useMemo(() => {
    if (!hour && !cities.length && !categories.length) return data;

    const startHour = hour ? sub(new Date(), { hours: +hour }) : undefined;
    const filteredRows = data.filter((row) => {
      return (
        (!startHour || isBefore(startHour, getDateWithoutOffset(row.Tarih))) &&
        (!cities.length || cities.includes(row.Şehir)) &&
        (!categories.length || categories.includes(row.Kategori))
      );
    });
    return filteredRows;
  }, [hour, data, cities, categories]);

  const markers = useMemo(
    () =>
      isMarkersDisplayed
        ? filtered.map((row) => (
            <Marker
              key={row.URL}
              position={{ lat: row.Enlem, lng: row.Boylam }}
              onClick={() => setTooltipRow(row)}
              icon={{
                url: `http://maps.google.com/mapfiles/ms/icons/${
                  colorMap[row.Şehir as keyof typeof colorMap]
                }.png`,
              }}
            ></Marker>
          ))
        : null,
    [filtered, isMarkersDisplayed]
  );

  const handleCityFilter = (value: string | City[]) => {
    setCities(typeof value === "string" ? (value.split(",") as City[]) : value);
  };

  const handleCategoryFilter = (value: string | string[]) => {
    setCategories(typeof value === "string" ? value.split(",") : value);
  };

  const heatmapData = useMemo(
    () =>
      isHeatmapDisplayed
        ? filtered.map(
            (row) => new window.google.maps.LatLng(row.Enlem, row.Boylam)
          )
        : [],
    [filtered, isHeatmapDisplayed]
  );

  return (
    <>
      <LoadScript googleMapsApiKey={MAPS_API_KEY} libraries={libraries as any}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={10}
          center={center}
          onClick={() => setTooltipRow(undefined)}
        >
          {markers}
          {tooltipRow && (
            <Tooltip tooltipRow={tooltipRow} setTooltipRow={setTooltipRow} />
          )}
          {isHeatmapDisplayed && (
            <HeatmapLayer data={heatmapData} options={{ radius: 30 }} />
          )}
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
          lastUpdatedDate={lastUpdatedDate}
          categories={categories}
          onCategoryFilter={handleCategoryFilter}
          numberOfRowsDisplayed={filtered.length}
          isHeatmapDisplayed={isHeatmapDisplayed}
          setHeatmapDisplayed={setHeatmapDisplayed}
          isMarkersDisplayed={isMarkersDisplayed}
          setMarkersDisplayed={setMarkersDisplayed}
        />
      )}
    </>
  );
}

export default App;

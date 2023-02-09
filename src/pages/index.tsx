import { MyLocation } from "@mui/icons-material";
import {
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios, { AxiosResponse } from "axios";
import { isBefore, sub } from "date-fns";
import dynamic from "next/dynamic";
import { FC, useEffect, useMemo, useState } from "react";
import Filters, { Hour } from "../components/filters";
import MapTooltip from "../components/map-tooltip";
import { MAPS_API_KEY } from "../config";
import { City, colorMap, jsonUrl } from "../constants";
import { getDateWithoutOffset } from "../utils";

const Heatmap = dynamic(() => import("../components/heatmap"), { ssr: false });

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

type ServerSideProps = {
  data: any[];
  lastModifiedDate: string;
};

// export async function getServerSideProps(): Promise<{
//   props: ServerSideProps;
// }> {
//   const response = await fetchRows();
//   return {
//     props: {
//       data: response?.data || [],
//       lastModifiedDate: response?.headers["last-modified"] || "",
//     },
//   };
// }

const App: FC = () => {
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
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>();
  const [categories, setCategories] = useState<string[]>([]);
  const [isHeatmapDisplayed, setHeatmapDisplayed] = useState(true);
  const [isMarkersDisplayed, setMarkersDisplayed] = useState(true);
  const [map, setMap] = useState<google.maps.Map>();
  const [isLocationErrorDisplayed, setLocationErrorDisplayed] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchRows()
      .then((response) => {
        if (!response) return;
        setData(response.data);
        setLastUpdatedDate(response.headers["last-modified"]);
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

  const handleLocationClick = () => {
    if (window.navigator.geolocation && map) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          map.panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          map.setZoom(15);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationErrorDisplayed(true);
          }
        }
      );
    }
  };

  const handleAlertClose = () => {
    setLocationErrorDisplayed(false);
  };

  return (
    <>
      <LoadScript googleMapsApiKey={MAPS_API_KEY} libraries={libraries as any}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={10}
          center={center}
          onClick={() => setTooltipRow(undefined)}
          onLoad={(map: any) => setMap(map)}
        >
          {markers}
          {tooltipRow && (
            <MapTooltip tooltipRow={tooltipRow} setTooltipRow={setTooltipRow} />
          )}
          <Heatmap data={filtered} isHeatmapDisplayed={isHeatmapDisplayed} />
        </GoogleMap>
      </LoadScript>
      <Backdrop open={isLoading}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Backdrop>
      {!isLoading && (
        <>
          <Paper sx={{ position: "fixed", right: 10, bottom: 200 }}>
            <Tooltip title="Konumumu göster">
              <IconButton onClick={handleLocationClick}>
                <MyLocation />
              </IconButton>
            </Tooltip>
          </Paper>
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
        </>
      )}
      <Snackbar
        open={isLocationErrorDisplayed}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        message=""
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Konumunuzu gösterme yetkisi yok.
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
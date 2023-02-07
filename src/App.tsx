import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MAPS_API_KEY } from "./config";
// import rows from "./data.json";

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

    // const data = await response.data;
    console.log(response.data);
    debugger;
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

function App() {
  const [rows, setRows] = useState<any[]>([]);
  const [tooltipRow, setTooltipRow] = useState<
    {
      Enlem: number;
      Boylam: number;
      "Google Maps URL": string;
    } & any
  >();

  useEffect(() => {
    fetchRows().then((data) => {
      setRows(data);
    });
  }, []);

  const markers = useMemo(
    () =>
      rows.map((row) => (
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
    [rows]
  );
  return (
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
                  <pre>{key}</pre>
                  {value}
                  <br />
                  {key === "Google Maps URL" && (
                    <a href={value as string} target="_blank" rel="noreferrer">
                      Google Haritalar'da ac
                    </a>
                  )}
                </>
              ))}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default App;

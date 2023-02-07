import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useMemo } from "react";
import "./App.css";
import { MAPS_API_KEY } from "./config";
import rows from "./data.json";

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

function App() {
  const markers = useMemo(
    () =>
      rows.map((row) => (
        <Marker
          key={row.URL}
          position={{ lat: row.Enlem, lng: row.Boylam }}
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${
              map[row.Şehir as keyof typeof map]
            }-dot.png`,
          }}
        />
      )),
    []
  );
  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} zoom={10} center={center}>
        {markers}
      </GoogleMap>
    </LoadScript>
  );
}

export default App;

import { colorMap } from "@/constants";
import { Marker, MarkerProps } from "@react-google-maps/api";
import { FC } from "react";

type Props = {
  clusterer?: MarkerProps["clusterer"];
  data: any[];
  onClick: (row: any) => void;
};

const Markers: FC<Props> = ({ clusterer, data, onClick }) => {
  return (
    <>
      {data.map((row) => (
        <Marker
          key={row.URL}
          position={{ lat: row.Enlem, lng: row.Boylam }}
          onClick={() => onClick(row)}
          clusterer={clusterer}
          noClustererRedraw
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${
              colorMap[row.Şehir as keyof typeof colorMap]
            }.png`,
          }}
        />
      ))}
    </>
  );
};

export default Markers;

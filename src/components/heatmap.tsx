import { HeatmapLayer } from "@react-google-maps/api";
import { FC, useMemo } from "react";

type Props = {
  isHeatmapDisplayed: boolean;
  data: any[];
};

const Heatmap: FC<Props> = ({ isHeatmapDisplayed, data }) => {
  const heatmapData = useMemo(() => {
    if (!isHeatmapDisplayed || !window?.google) return [];

    return data.map(
      (row) => new window.google.maps.LatLng(row.Enlem, row.Boylam)
    );
  }, [data, isHeatmapDisplayed]);

  if (!isHeatmapDisplayed) return null;

  return <HeatmapLayer data={heatmapData} options={{ radius: 30 }} />;
};

export default Heatmap;

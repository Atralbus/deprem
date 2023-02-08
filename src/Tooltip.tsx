import { Link, Stack, Typography } from "@mui/material";
import { InfoWindow } from "@react-google-maps/api";
import { format } from "date-fns";
import { FC, useCallback } from "react";
import { getDateWithoutOffset } from "./utils";

type Datum = {
  Enlem: number;
  Boylam: number;
  "Google Maps URL": string;
};

type Props = {
  tooltipRow: Datum;
  setTooltipRow: (tooltipRow?: Datum) => void;
};

const Tooltip: FC<Props> = ({ tooltipRow, setTooltipRow }) => {
  const getLabel = useCallback((key: string, value: string | number) => {
    switch (key) {
      case "URL":
        return (
          <Link href={value as string} target="_blank" rel="noreferrer">
            {value}
          </Link>
        );
      case "Tarih":
        return format(
          getDateWithoutOffset(value as any),
          "dd/MM/yyyy HH:mm:ss"
        );
      case "Google Maps URL":
        return (
          <Link href={value as string} target="_blank" rel="noreferrer">
            Google Haritalar'da aç
          </Link>
        );
      default:
        return value;
    }
  }, []);

  return (
    <InfoWindow
      position={{ lat: tooltipRow.Enlem, lng: tooltipRow.Boylam }}
      options={{
        pixelOffset: { height: -20, equals: () => true, width: 0 },
      }}
      onCloseClick={() => setTooltipRow(undefined)}
    >
      <Stack spacing={1} sx={{ wordBreak: "break-word" }}>
        {Object.entries(tooltipRow).map(([key, value]) => (
          <div>
            <Typography variant="subtitle2" component="div">
              {key}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              <>{getLabel(key, value)}</>
            </Typography>
          </div>
        ))}
      </Stack>
    </InfoWindow>
  );
};

export default Tooltip;

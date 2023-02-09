import { isBefore, sub } from "date-fns";
import { Hour } from "../../components/filters";
import { getDateWithoutOffset } from "../../utils";

class CacheStore {
  private data: Record<string, any[]> = {
    all: [],
    [Hour.H1]: [],
    [Hour.H2]: [],
    [Hour.H4]: [],
    [Hour.H8]: [],
  };

  constructor() {}

  private getDataWithHour(args: { data: any[]; hour: Hour }): any[] {
    const { data, hour } = args;
    const startHour = sub(new Date(), { hours: +hour });
    return data.filter((row) =>
      isBefore(startHour, getDateWithoutOffset(row.Tarih))
    );
  }

  public cache(data: any): void {
    this.data = {
      all: data,
      [Hour.H1]: this.getDataWithHour({ data, hour: Hour.H1 }),
      [Hour.H2]: this.getDataWithHour({ data, hour: Hour.H2 }),
      [Hour.H4]: this.getDataWithHour({ data, hour: Hour.H4 }),
      [Hour.H8]: this.getDataWithHour({ data, hour: Hour.H8 }),
    };
  }

  public get(hour: string): any[] {
    if (!hour) return this.data.all;

    return this.data[hour] || [];
  }
}

export const cacheStore = new CacheStore();

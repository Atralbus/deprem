export enum City {
  Hatay = "hatay",
  Kahramanmaraş = "kahramanmaraş",
  Adıyaman = "adıyaman",
  Malatya = "malatya",
  Gaziantep = "gaziantep",
  Diyarbakır = "diyarbakır",
  Osmaniye = "osmaniye",
  Elazığ = "elazığ",
  Adana = "adana",
  Kilis = "kilis",
  Sanliurfa = "şanlıurfa",
}

export enum Category {
  Enkaz = "Enkaz",
  Sağlık = "Sağlık",
  BarınmaKıyafet = "Barınma/kıyafet",
  YiyecekSu = "Yiyecek/su",
  Temizlik = "Temizlik",
  İletişim = "İletişim",
}

export const categoryOptions = Object.values(Category);

export const cities = Object.values(City);

export const colorMap = {
  [City.Hatay]: "yellow-dot",
  [City.Kahramanmaraş]: "blue-dot",
  [City.Adıyaman]: "green-dot",
  [City.Malatya]: "ltblue-dot",
  [City.Gaziantep]: "orange-dot",
  [City.Diyarbakır]: "pink-dot",
  [City.Osmaniye]: "purple-dot",
  [City.Elazığ]: "red-dot",
  [City.Kilis]: "lightblue",
  [City.Adana]: "pink",
  [City.Sanliurfa]: "yellow",
};

const baseUrl = "https://storage.googleapis.com/deprem-app-bucket/database.";
export const jsonUrl = `${baseUrl}json`;
export const xlsxUrl = `${baseUrl}xlsx`;

export const baseMapsUrl = "https://maps.google.com/?q=";

export type Datum = {
  Enlem: number;
  Boylam: number;
  Kategori: Category[];
  URL: string;
  Tarih: number;
  Tweet: string;
  "Kullanıcı adı": string;
  Şehir: City;
  "Telefon no": string;
};

export enum Hour {
  H1 = "1",
  H2 = "2",
  H4 = "4",
  H8 = "8",
}

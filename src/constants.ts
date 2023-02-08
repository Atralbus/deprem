export enum City {
  Hatay = "hatay",
  Kahramanmaraş = "kahramanmaraş",
  Adıyaman = "adıyaman",
  Malatya = "malatya",
  Gaziantep = "gaziantep",
  Diyarbakır = "diyarbakır",
  Osmaniye = "osmaniye",
  Elazığ = "elazığ",
}

export const cities = Object.values(City);

export const colorMap = {
  [City.Hatay]: "yellow",
  [City.Kahramanmaraş]: "blue",
  [City.Adıyaman]: "green",
  [City.Malatya]: "ltblue",
  [City.Gaziantep]: "orange",
  [City.Diyarbakır]: "pink",
  [City.Osmaniye]: "purple",
  [City.Elazığ]: "red",
};

const baseUrl = "https://storage.googleapis.com/deprem-app-bucket/database.";
export const jsonUrl = `${baseUrl}json`;
export const xlsxUrl = `${baseUrl}xlsx`;

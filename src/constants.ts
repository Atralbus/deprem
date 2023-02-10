export enum City {
  Hatay = 'hatay',
  Kahramanmaraş = 'kahramanmaraş',
  Adıyaman = 'adıyaman',
  Malatya = 'malatya',
  Gaziantep = 'gaziantep',
  Diyarbakır = 'diyarbakır',
  Osmaniye = 'osmaniye',
  Elazığ = 'elazığ',
  Adana = 'adana',
  Kilis = 'kilis',
  Sanliurfa = 'şanlıurfa',
}

export const categoryOptions = [
  'Enkaz',
  'Sağlık',
  'Barınma/kıyafet',
  'Yiyecek/su',
  'Temizlik',
  'İletişim',
];

export const cities = Object.values(City);

export const colorMap = {
  [City.Hatay]: 'yellow-dot',
  [City.Kahramanmaraş]: 'blue-dot',
  [City.Adıyaman]: 'green-dot',
  [City.Malatya]: 'ltblue-dot',
  [City.Gaziantep]: 'orange-dot',
  [City.Diyarbakır]: 'pink-dot',
  [City.Osmaniye]: 'purple-dot',
  [City.Elazığ]: 'red-dot',
  [City.Kilis]: 'lightblue',
  [City.Adana]: 'pink',
  [City.Sanliurfa]: 'red-dot',
};

const baseUrl = 'https://storage.googleapis.com/deprem-app-bucket/database.';
export const jsonUrl = `${baseUrl}json`;
export const xlsxUrl = `${baseUrl}xlsx`;

export const baseMapsUrl = 'https://maps.google.com/?q=';

export interface Wilayah {
  code: string;
  name: string;
}

export interface WilayahMeta {
  administrative_area_level: number;
  updated_at: string;
}

export interface WilayahResponse {
  data: Wilayah[];
  meta: WilayahMeta;
}

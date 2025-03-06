export type ITimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export interface ICountDown {
  eventName: string;
  endDate: string;
}

export type TimeKey = "days" | "hours" | "minutes" | "seconds";

export interface IBox {
  id: number;
  key: TimeKey;
}

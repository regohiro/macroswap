export type usePartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

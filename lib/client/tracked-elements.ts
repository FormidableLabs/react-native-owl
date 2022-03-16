export type ElementActions = {
  ref: any;
  onPress: Function;
};

const trackedElements: Record<string, ElementActions> = {};

export const get = (ID: string) => {
  return trackedElements[ID];
};

export const exists = (ID: string) => {
  return get(ID) !== undefined;
};

export const add = (ID: string, data: ElementActions) => {
    trackedElements[ID] = data;
}

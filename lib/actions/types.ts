export type ACTION =
  | 'PRESS'
  | 'LONG_PRESS'
  | 'ENTER_TEXT'
  | 'SCROLL_TO'
  | 'SCROLL_TO_END';

export type LAYOUT_ACTION = 'EXISTS' | 'SIZE';

export type SOCKET_TYPE_SCROLL_TO_VALUE = {
  x?: number | undefined;
  y?: number | undefined;
  animated?: boolean | undefined;
};

export type SOCKET_TYPE_VALUE = string | SOCKET_TYPE_SCROLL_TO_VALUE;

export type SOCKET_EVENT =
  | {
      type: 'ACTION';
      action: ACTION;
      testID: string;
      value?: SOCKET_TYPE_VALUE;
    }
  | {
      type: 'LAYOUT';
      action: LAYOUT_ACTION;
      testID: string;
    }
  | {
      type: 'DONE';
    }
  | {
      type: 'NOT_FOUND';
      testID: string;
    }
  | {
      type: 'ERROR';
      message: string;
      testID: string;
    };

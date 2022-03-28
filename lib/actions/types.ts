export type ACTION = 'TAP';
export type LAYOUT_ACITON = 'EXISTS' | 'SIZE';

export type SOCKET_EVENT =
  | {
      type: 'ACTION';
      action: ACTION;
      testID: string;
    }
  | {
      type: 'LAYOUT';
      action: LAYOUT_ACITON;
      testID: string;
    }
  | {
      type: 'DONE';
      data?: Record<string, any>;
    }
  | {
      type: 'NOT_FOUND';
    };

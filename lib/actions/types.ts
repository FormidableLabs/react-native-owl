export type ACTION = 'TAP' | 'CLEAR_TEXT' | 'ENTER_TEXT';
export type LAYOUT_ACTION = 'EXISTS' | 'SIZE';

export type SOCKET_EVENT =
  | {
      type: 'ACTION';
      action: ACTION;
      testID: string;
      value?: string;
    }
  | {
      type: 'LAYOUT';
      action: LAYOUT_ACTION;
      testID: string;
    }
  | {
      type: 'DONE';
      data?: Record<string, any>;
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

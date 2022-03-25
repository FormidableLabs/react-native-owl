export type ACTION = 'TAP'

export type SOCKET_EVENT = {
    type: 'ACTION', action: ACTION, testID: string
} | {
    type: 'DONE', data?: Record<string, any>
} | {
    type: 'NOT_FOUND'
}
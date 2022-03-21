import WebSocket from "ws";

export const tapOn = async(testId: string) => {
    const client = new WebSocket('wss://localhost:8123');

    console.info("sending event", client)
    // client.onopen = (event) => {
    //     console.info({event})
    //     client.send("hello world")
    // }

    return new Promise(resolve => {
    })
}
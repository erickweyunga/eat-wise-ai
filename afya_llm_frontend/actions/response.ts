"use server"
const api_url = process.env.BACKEND_URL;
export async function getResponse(message: string) {

    type ResponseData = {
        id: number,
        text: string
        sender: string
        props: "enable_input" | "disable_input"
    };

    return new Promise<string>(async (resolve) => {
        const response = await fetch(`${api_url}/afya/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }),
        });
        if (response.ok) {
            const data: ResponseData = await response.json();
            resolve(data.text);
        } else {
            return new Error('Failed to fetch data');
        }

    });
}

export async function getIntents({ message, intents_type }: { message: string, intents_type: string }) {

    type Reply = {
        id: number,
        title: string
    }

    type Button = {
        type: string,
        reply: Reply
    }

    type ResponseData = {
        id: number,
        sender: string,
        props: "enable_input" | "disable_input",
        text: string
        action?: {
            buttons: Button[]
        }
    };

    const response = await fetch(`${api_url}/afya/intents/${intents_type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
    });

    if (response.ok) {
        const data: ResponseData = await response.json();
        return data;
    } else {
        return new Error('Failed to fetch data') as never;
    }

}

export async function onButtonClick(buttonId: number, buttonTitle: string) {
    console.log(`Button clicked: ${buttonId}, ${buttonTitle}`);
}
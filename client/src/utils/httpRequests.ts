import axios from 'axios';

export async function getData(url: string) {
    try {
        const data = await axios.get(url);
        if (data.data) {
            return data.data;
        }
        else {
            return null;
        }
    }
    catch (e) {
        return e.message;
    }
}
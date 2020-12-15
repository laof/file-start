import { environment } from "src/environments/environment";
export const HttpLocalhost = environment.production ? location.origin : 'http://localhost:5200';

export const HttpUrl = {
    list: '/api/list',
    upload: '/api/upload',
    host: '/api/host',
    download: '/api/download',
    talkHistory: '/api/talk_history',
}



import {
  AUTH_TOKEN,
  USER_NAME,
  APPLICATION_NAMES,
  APPLICATION_NAME,
  clientType,
  CLIENT_USER_NAME,
  EnglishLanguage,
} from "@ranjodhbirkaur/constants";
import {
  LOCAL_STORAGE_SELECTED_APPLICATION_NAME,
} from "../../../../utils/constants";

interface SaveAuthenticationType {
  [AUTH_TOKEN]?: string;
  [USER_NAME]?: string;
  [APPLICATION_NAMES]?: string;
  [APPLICATION_NAME]?: string;
  [clientType]?: string;
  [CLIENT_USER_NAME]?: string;
}

export function saveAuthentication(response: SaveAuthenticationType) {
  if (response[APPLICATION_NAMES]) {
    localStorage.setItem(
      APPLICATION_NAMES,
      JSON.stringify(response[APPLICATION_NAMES]) ||
        JSON.stringify([
          {
            name: "",
            languages: [EnglishLanguage],
          },
        ])
    );
  }

  if (response[clientType]) {
    localStorage.setItem(clientType, response[clientType] || "");
  }
  if (response[CLIENT_USER_NAME]) {
    localStorage.setItem(CLIENT_USER_NAME, response[CLIENT_USER_NAME] || "");
  }
  localStorage.setItem(AUTH_TOKEN, response[AUTH_TOKEN] || "");
  localStorage.setItem(USER_NAME, response[USER_NAME] || "");
}

export function checkAuthentication(): boolean {
  try {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const userName = localStorage.getItem(USER_NAME);
    return !!(authToken && userName);
  } catch (e) {
    return true;
  }
}

export function clearAuthentication() {
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(APPLICATION_NAMES);
  localStorage.removeItem(USER_NAME);
  localStorage.removeItem(clientType);
  localStorage.removeItem(CLIENT_USER_NAME);
  localStorage.removeItem(LOCAL_STORAGE_SELECTED_APPLICATION_NAME);
  localStorage.clear();
}

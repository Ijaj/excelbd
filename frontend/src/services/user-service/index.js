import axios from 'axios';
import { getToken } from 'utils/helper';

// generate a config object for axios requests
// add jwt token if available
export function generateConfigWithToken(token) {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}

export async function service_allAgents() {
  const token = getToken();
  const config = generateConfigWithToken(token);

  const url = `${process.env.REACT_APP_API_URL}/user/agents/`;
  try {
    const result = await axios.get(url, config);
    if (result.status === 200) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    return null;
  }
}

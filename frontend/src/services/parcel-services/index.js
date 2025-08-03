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

export async function service_allParcels() {
  const token = getToken();
  const config = generateConfigWithToken(token);

  const url = `${process.env.REACT_APP_API_URL}/parcel/`;
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

export async function service_parcelsByEmail(email) {
  const token = getToken();
  const config = generateConfigWithToken(token);
  const url = `${process.env.REACT_APP_API_URL}/parcel/user/${email}`;
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

export async function service_parcelByTrackingNumber(trackingNumber) {
  const token = getToken();
  const config = generateConfigWithToken(token);
  const url = `${process.env.REACT_APP_API_URL}/parcel/${trackingNumber}`;
  try {
    const result = await axios.get(url, config);
    if (result.status === 200) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function service_parcelsByAgent(agentId) {
  const token = getToken();
  const config = generateConfigWithToken(token);
  const url = `${process.env.REACT_APP_API_URL}/parcel/agent/${agentId}`;
  try {
    const result = await axios.get(url, config);
    if (result.status === 200) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
}

export async function service_createParcel(parcelData) {
  const token = getToken();
  const config = generateConfigWithToken(token);

  const url = `${process.env.REACT_APP_API_URL}/parcel/`;
  try {
    const result = await axios.post(url, parcelData, config);
    if (result.status === 201) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function service_updateParcel(parcelId, parcelData) {
  const token = getToken();
  const config = generateConfigWithToken(token);

  const url = `${process.env.REACT_APP_API_URL}/parcel/${parcelId}`;
  try {
    const result = await axios.patch(url, parcelData, config);
    if (result.status === 200) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function service_deleteParcel(parcelId) {
  const token = getToken();
  const config = generateConfigWithToken(token);

  const url = `${process.env.REACT_APP_API_URL}/parcel/${parcelId}`;
  try {
    const result = await axios.delete(url, config);
    if (result.status === 204) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

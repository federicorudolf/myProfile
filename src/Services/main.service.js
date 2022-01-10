import axios from 'axios';

export const getBitcoinPrice = () => {
  const url = "https://us-central1-myprofile-4928d.cloudfunctions.net/getBitcoinPrice";
  return axios.get(url);
}
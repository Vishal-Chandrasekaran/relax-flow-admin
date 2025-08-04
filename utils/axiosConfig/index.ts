import axios from 'axios';

const instance = axios.create({
    // Insert your api base url
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API}`
});

export default instance;

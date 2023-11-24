import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1,
  duration: '20s',
};

const BASE_URL = 'https://diploma-insight.onrender.com';
const userCredentials = {
  email: 'admin@a',
  password: '123',
};

export default function () {
  let headers = {};

  // Login
  let res = http.post(`${BASE_URL}/login`, userCredentials);
  checkResponse(res, 200, 'Login');
  
  // If the API returns a token, include it in the subsequent requests
  if (res.json().token) {
    headers = {
      'Authorization': `Bearer ${res.json().token}`,
    };
  }

  // Logout
  res = http.post(`${BASE_URL}/logout`, null, { headers: headers });
  checkResponse(res, 200, 'Logout');

  // Fetch Study Program by ID
  res = http.get(`${BASE_URL}/studyProgram/studyProgram/2`, { headers: headers });
  checkResponse(res, 200, 'Fetch Study Program');

  // Fetch University by ID
  res = http.get(`${BASE_URL}/university/university/2`, { headers: headers });
  checkResponse(res, 200, 'Fetch University');

  // Fetch Faculty by ID
  res = http.get(`${BASE_URL}/faculty/faculty/2`, { headers: headers });
  checkResponse(res, 200, 'Fetch Faculty');

  sleep(1);
}

function checkResponse(res, expectedStatus, actionName) {
  check(res, { [`${actionName} status is ${expectedStatus}`]: (r) => r.status === expectedStatus });
  if (res.status !== expectedStatus) {
    console.error(`Unexpected status code for ${actionName}: ${res.status}. Body: ${res.body}`);
  }
}
